<script lang="ts">
  let greeting = 'Hello, World!';
</script>

<main>
  <div class="header">
    <img src="../assets/icon-48.svg" alt="TubeLock" class="logo" />
    <h1>TubeLock</h1>
  </div>
  
  <div class="content">
    <p class="greeting">{greeting}</p>
    <p class="description">Your browser extension is ready!</p>
  </div>
</main>

<style>
  main {
    padding: 16px;
    text-align: center;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 16px;
  }

  .logo {
    width: 32px;
    height: 32px;
  }

  h1 {
    margin: 0;
    font-size: 1.4rem;
    color: #333;
  }

  .content {
    padding: 16px;
    background: #f5f5f5;
    border-radius: 8px;
  }

  .greeting {
    font-size: 1.2rem;
    font-weight: 600;
    color: #2563eb;
    margin: 0 0 8px 0;
  }

  .description {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
  }
</style>
