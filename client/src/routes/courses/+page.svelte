<script>
  import { onMount } from "svelte";

  let courses = [];
  let name = "";

  const loadCourses = async () => {
    const res = await fetch("/api/courses");
    courses = await res.json();
  };

  const addCourse = async () => {
    await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });

    name = "";
    await loadCourses();
  };

  onMount(loadCourses);
</script>

<h1>Courses</h1>

<ul>
  {#each courses as course}
    <li>
      <a href={`/courses/${course.id}/`}>{course.name}</a>
    </li>
  {/each}
</ul>

<h2>Add course</h2>

<form on:submit|preventDefault={addCourse}>
  <input
    type="text"
    name="name"
    placeholder="Course name"
    bind:value={name}
    required
  />
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
</style>
