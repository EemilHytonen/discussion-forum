<script>
  let message = "";
  let error = "";

  const fetchMessage = async () => {
    message = "";
    error = "";

    try {
      const res = await fetch("/api/health");

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status} ${text}`);
      }

      const data = await res.json();
      message = `API OK (${data.time})`;
    } catch (e) {
      error = e?.message ?? String(e);
    }
  };
</script>

<button on:click={fetchMessage}>
  Test API connection
</button>

{#if message}
  <p>{message}</p>
{/if}

{#if error}
  <p style="color: red;">
    API ERROR: {error}
  </p>
{/if}
