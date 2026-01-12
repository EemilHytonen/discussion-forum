<script>
  import Message from "$lib/components/Message.svelte";
  import Questions from "$lib/components/Questions.svelte";
</script>

<Message />
<Questions />

<h1>Welcome!</h1>
<p>Click below to see the courses.</p>
<a href="/courses"><button>Courses</button></a>

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

