<script>
  let running = false;
  let selected = new Set();
  let results = []; // { name, ok, ms, details }

  const now = () => performance.now();

  function resetResults() {
    results = [];
  }

  function toggle(name) {
    const s = new Set(selected);
    if (s.has(name)) s.delete(name);
    else s.add(name);
    selected = s;
  }

  function addResult(name, ok, ms, details = "") {
    results = [...results, { name, ok, ms: Math.round(ms), details }];
  }

  async function jsonOrText(res) {
    const ct = res.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) return await res.json();
    return await res.text();
  }

  async function apiGet(path) {
    return fetch(path, { method: "GET" });
  }

  async function apiPostJson(path, bodyObj) {
    return fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyObj),
    });
  }

  async function apiPost(path) {
    return fetch(path, { method: "POST" });
  }

  async function apiDelete(path) {
    return fetch(path, { method: "DELETE" });
  }

  const tests = [
    {
      name: "Health returns ok=true",
      run: async () => {
        const res = await apiGet("/api/health");
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
        const data = await res.json();
        if (data.ok !== true) throw new Error(`Expected ok=true, got: ${JSON.stringify(data)}`);
      },
    },
    {
      name: "Courses list returns array",
      run: async () => {
        const res = await apiGet("/api/courses");
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Expected an array");
      },
    },
    {
      name: "Create + delete course works",
      run: async () => {
        const suffix = Math.random().toString(16).slice(2);
        const courseName = `TEST course ${suffix}`;

        const createRes = await apiPostJson("/api/courses", { name: courseName });
        if (!createRes.ok) {
          const body = await jsonOrText(createRes);
          throw new Error(`Create failed: HTTP ${createRes.status}: ${JSON.stringify(body)}`);
        }
        const created = await createRes.json();
        if (!created?.id) throw new Error(`Create returned no id: ${JSON.stringify(created)}`);

        const delRes = await apiDelete(`/api/courses/${created.id}`);
        if (!delRes.ok) {
          const body = await jsonOrText(delRes);
          throw new Error(`Delete failed: HTTP ${delRes.status}: ${JSON.stringify(body)}`);
        }
      },
    },
    {
      name: "Create question + upvote + delete (temp course)",
      run: async () => {
        const suffix = Math.random().toString(16).slice(2);
        const courseName = `TEST course for questions ${suffix}`;

        // 1) create temp course
        const courseRes = await apiPostJson("/api/courses", { name: courseName });
        if (!courseRes.ok) throw new Error(`Course create failed: ${courseRes.status}: ${await courseRes.text()}`);
        const course = await courseRes.json();
        if (!course?.id) throw new Error(`Course create returned no id: ${JSON.stringify(course)}`);

        // 2) add question
        const qTitle = `TEST question ${suffix}`;
        const qText = `This is a test question body ${suffix}`;

        const qRes = await apiPostJson(`/api/courses/${course.id}/questions`, { title: qTitle, text: qText });
        if (!qRes.ok) throw new Error(`Question create failed: ${qRes.status}: ${await qRes.text()}`);
        const q = await qRes.json();
        if (!q?.id) throw new Error(`Question create returned no id: ${JSON.stringify(q)}`);

        // 3) upvote (no body needed)
        const upRes = await apiPost(`/api/courses/${course.id}/questions/${q.id}/upvote`);
        if (!upRes.ok) throw new Error(`Upvote failed: ${upRes.status}: ${await upRes.text()}`);
        const up = await upRes.json();
        if (typeof up?.upvotes !== "number") throw new Error(`Upvote returned weird: ${JSON.stringify(up)}`);

        // 4) delete question
        const dqRes = await apiDelete(`/api/courses/${course.id}/questions/${q.id}`);
        if (!dqRes.ok) throw new Error(`Delete question failed: ${dqRes.status}: ${await dqRes.text()}`);

        // 5) delete course
        const dcRes = await apiDelete(`/api/courses/${course.id}`);
        if (!dcRes.ok) throw new Error(`Delete course failed: ${dcRes.status}: ${await dcRes.text()}`);
      },
    },
  ];

  async function runTest(t) {
    const start = now();
    try {
      await t.run();
      addResult(t.name, true, now() - start);
    } catch (e) {
      addResult(t.name, false, now() - start, e?.message ?? String(e));
    }
  }

  async function runSelected() {
    running = true;
    resetResults();
    try {
      const toRun = tests.filter(t => selected.has(t.name));
      for (const t of toRun) await runTest(t);
    } finally {
      running = false;
    }
  }

  async function runAll() {
    running = true;
    resetResults();
    try {
      for (const t of tests) await runTest(t);
    } finally {
      running = false;
    }
  }

  function selectAll() {
    selected = new Set(tests.map(t => t.name));
  }

  function clearSelection() {
    selected = new Set();
  }
</script>

<div style="display:flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
  <button disabled={running} on:click={runAll}>Run all</button>
  <button disabled={running || selected.size === 0} on:click={runSelected}>Run selected</button>
  <button disabled={running} on:click={selectAll}>Select all</button>
  <button disabled={running} on:click={clearSelection}>Clear</button>
</div>

<div style="margin-bottom: 12px;">
  {#each tests as t}
    <label style="display:block; margin: 6px 0;">
      <input
        type="checkbox"
        disabled={running}
        checked={selected.has(t.name)}
        on:change={() => toggle(t.name)}
      />
      {t.name}
    </label>
  {/each}
</div>

{#if results.length > 0}
  <h3>Results</h3>
  <ul>
    {#each results as r}
      <li style="margin: 8px 0;">
        <strong>{r.ok ? "PASS" : "FAIL"}</strong>
        — {r.name} ({r.ms} ms)
        {#if !r.ok}
          <div style="white-space: pre-wrap; margin-top: 4px;">{r.details}</div>
        {/if}
      </li>
    {/each}
  </ul>
{/if}
