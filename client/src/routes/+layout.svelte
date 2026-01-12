<script>
  import { page } from '$app/stores';
</script>

<header>
  <nav>
    <a href="/" class:active={$page.url.pathname === '/'}>Home</a>
    <a href="/courses" class:active={$page.url.pathname.startsWith('/courses')}>Courses</a>
  </nav>
</header>

<main>
  <slot />
</main>

<style>
  header {
    background-color: #2c3e50;
    padding: 1rem 2rem;
  }

  nav {
    display: flex;
    gap: 1.5rem;
  }

  nav a {
    color: #ecf0f1;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.2s;
  }

  nav a:hover {
    color: #3498db;
  }

  .active {
    text-decoration: underline;
    color: #3498db;
  }

  main {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
  }
</style>
