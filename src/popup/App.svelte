<script lang="ts">
  import TimeBudgetForm from './components/TimeBudgetForm.svelte';
</script>

<main class="app">
  <header class="header">
    <div class="brand">
      <img src="../assets/icon-48.svg" alt="TubeLock" class="logo" />
      <div class="brandText">
        <h1 class="appTitle">TubeLock</h1>
        <p class="tagline">Set time limits per site.</p>
      </div>
    </div>
  </header>

  <TimeBudgetForm />

  <footer class="footer">
    <span class="footerText">Settings UI only</span>
  </footer>
</main>

<style>
  :global(:root) {
    --bg: #0b1220;
    --surface: #0f1b2e;
    --text: rgba(255, 255, 255, 0.92);
    --muted: rgba(255, 255, 255, 0.68);
    --border: rgba(255, 255, 255, 0.14);
    --accent: #60a5fa;
    --radius-lg: 14px;
    --radius-md: 12px;
    --shadow-sm: 0 10px 28px rgba(0, 0, 0, 0.22);
  }

  :global(body) {
    margin: 0;
    background: radial-gradient(1200px 420px at 30% 0%, rgba(96, 165, 250, 0.18), transparent 55%),
      radial-gradient(900px 420px at 90% 30%, rgba(37, 99, 235, 0.18), transparent 55%),
      var(--bg);
    color: var(--text);
  }

  .app {
    padding: 14px;
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
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.25);
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
    display: flex;
    justify-content: center;
    padding-top: 2px;
  }

  .footerText {
    font-size: 11px;
    color: color-mix(in srgb, var(--muted) 80%, transparent);
  }
</style>
