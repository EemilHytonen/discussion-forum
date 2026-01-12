<script>
  import { onMount } from "svelte";

  export let data;
  const courseId = data.courseId;

  let course = null;
  let questions = [];

  let title = "";
  let text = "";

  const loadCourse = async () => {
    const res = await fetch(`/api/courses/${courseId}`);
    course = await res.json();
  };

  const loadQuestions = async () => {
    const res = await fetch(`/api/courses/${courseId}/questions`);
    questions = await res.json();
  };

  const addQuestion = async () => {
    await fetch(`/api/courses/${courseId}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, text })
    });

    title = "";
    text = "";
    await loadQuestions();
  };

  const upvote = async (qId) => {
    await fetch(`/api/courses/${courseId}/questions/${qId}/upvote`, {
      method: "POST"
    });

    await loadQuestions();
  };

  const remove = async (qId) => {
    await fetch(`/api/courses/${courseId}/questions/${qId}`, {
      method: "DELETE"
    });

    await loadQuestions();
  };

  onMount(async () => {
    await loadCourse();
    await loadQuestions();
  });
</script>

{#if course}
  <h1>{course.name}</h1>
{/if}

<h2>Questions</h2>

<ul>
  {#each questions as q}
    <li>
      <div>{q.title}</div>
      <div>Upvotes: {q.upvotes}</div>
      <button on:click={() => upvote(q.id)}>Upvote</button>
      <button on:click={() => remove(q.id)}>Delete</button>
    </li>
  {/each}
</ul>

<h2>Add question</h2>

<form on:submit|preventDefault={addQuestion}>
  <input
    type="text"
    name="title"
    placeholder="Title"
    bind:value={title}
    required
  />
  <textarea
    name="text"
    placeholder="Text"
    bind:value={text}
    required
  ></textarea>
  <button type="submit">Add</button>
</form>

<style>
  h1 {
    font-size: 2rem;
    color: #2c3e50;
  }

  button {
    margin-top: 1rem;
  }

  p {
    margin-top: 1rem;
    font-size: 1.2rem;
  }
</style>