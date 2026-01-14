<script lang="ts">
  import TimeBudgetForm from './components/TimeBudgetForm.svelte';
</script>

<main class="app">
  <header class="header">
    <div class="brand">
      <img src="../assets/clocklock_logo_solid_128.png" alt="ClockLock" class="logo" />
      <div class="brandText">
        <h1 class="appTitle">ClockLock</h1>
        <p class="tagline">Set time limits per site.</p>
      </div>
    </div>
  </header>

  <TimeBudgetForm />

  <footer class="footer">
    <p class="footerText">
      ClockLock is free and open source. If you found it useful, you can check it out on
      <a
        href="https://github.com/antouhou/clocklock"
        target="_blank"
        rel="noopener noreferrer"
        class="link">GitHub</a
      >.
    </p>
  </footer>
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

  .footer {
    margin-top: 4px;
    padding-top: 12px;
    border-top: 1px solid color-mix(in srgb, var(--border) 50%, transparent);
  }

  .footerText {
    margin: 0;
    font-size: 11px;
    line-height: 1.4;
    color: var(--muted);
    text-align: center;
  }

  .link {
    color: var(--accent);
    text-decoration: none;
    font-weight: 600;
  }

  .link:hover {
    text-decoration: underline;
  }
</style>
