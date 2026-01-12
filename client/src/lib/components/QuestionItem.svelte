<script>
  import { upvoteQuestion, deleteQuestion } from "$lib/states/questionState.svelte.js";

  let { question } = $props();
</script>

<div>
  <h3>{question.title}</h3>
  <p>{question.text}</p>

  <p>Upvotes: {question.upvotes}</p>

  <button onclick={() => upvoteQuestion(question.id)}>
    Upvote
  </button>

  <button onclick={() => deleteQuestion(question.id)}>
    Delete
  </button>
</div>
