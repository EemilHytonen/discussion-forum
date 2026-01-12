<script>
  import { onMount } from "svelte";
  import { fetchQuestions } from "$lib/states/questionState.svelte.js";

  import QuestionForm from "./QuestionForm.svelte";
  import QuestionList from "./QuestionList.svelte";

  onMount(() => {
    fetchQuestions();
  });
</script>

<QuestionForm />
<QuestionList />
