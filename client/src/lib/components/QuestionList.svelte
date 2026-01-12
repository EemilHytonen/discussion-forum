<script>
  import { questions } from "$lib/states/questionState.svelte.js";
  import QuestionItem from "./QuestionItem.svelte";
</script>

{#if $questions.length === 0}
  <p>No questions.</p>
{:else}
  {#each $questions as question (question.id)}
    <QuestionItem {question} />
  {/each}
{/if}
