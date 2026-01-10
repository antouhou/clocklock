<script lang="ts">
  import TimeBudgetForm from './components/TimeBudgetForm.svelte';
</script>

<main class="app">
  <header class="header">
    <div class="brand">
      <img src="../assets/icon-48.svg" alt="ClockLock" class="logo" />
      <div class="brandText">
        <h1 class="appTitle">ClockLock</h1>
        <p class="tagline">Set time limits per site.</p>
      </div>
    </div>
  </header>

  <TimeBudgetForm />
</main>

<style>
  :global(*:focus-visible) {
    outline: 2px solid color-mix(in srgb, var(--accent) 70%, transparent);
    outline-offset: 2px;
  }

  .app {
    padding: var(--space-3);
    display: grid;
    gap: 12px;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .logo {
    width: 34px;
    height: 34px;
    flex: 0 0 auto;
    border-radius: 10px;
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.42);
  }

  .brandText {
    display: grid;
    gap: 2px;
  }

  .appTitle {
    margin: 0;
    font-size: 15px;
    font-weight: 750;
    letter-spacing: 0.2px;
    line-height: 1.1;
  }

  .tagline {
    margin: 0;
    font-size: 12px;
    color: var(--muted);
    line-height: 1.2;
  }
</style>
