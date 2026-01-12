<script>
  import { addQuestion } from "$lib/states/questionState.svelte.js";

  let title = "";
  let text = "";

  async function submit() {
    if (!title.trim() || !text.trim()) return;

    await addQuestion(title, text);
    title = "";
    text = "";
  }
</script>

<form onsubmit={(e) => { e.preventDefault(); submit(); }}>
  <input
    type="text"
    name="title"
    placeholder="Question title"
    bind:value={title}
  />

  <textarea
    name="text"
    placeholder="Question text"
    bind:value={text}
  ></textarea>

  <input type="submit" value="Add question" />
</form>
