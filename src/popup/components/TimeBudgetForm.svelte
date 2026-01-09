<script lang="ts">
  export let watchSeconds = 600;
  export let blockSeconds = 1800;
</script>

<section class="card" aria-label="Time settings">
  <div class="cardHeader">
    <h2 class="title">Time limits</h2>
    <p class="subtitle">Set how long you can watch YouTube, then how long to block it.</p>
  </div>

  <div class="fields">
    <div class="field">
      <label class="label" for="watchSeconds">Watch time</label>
      <div class="control">
        <input
          id="watchSeconds"
          class="input"
          type="number"
          min="0"
          step="1"
          inputmode="numeric"
          bind:value={watchSeconds}
        />
        <span class="suffix">seconds</span>
      </div>
      <p class="help">When this reaches 0, YouTube gets blocked.</p>
    </div>

    <div class="divider" role="separator" aria-hidden="true"></div>

    <div class="field">
      <label class="label" for="blockSeconds">Block duration</label>
      <div class="control">
        <input
          id="blockSeconds"
          class="input"
          type="number"
          min="0"
          step="1"
          inputmode="numeric"
          bind:value={blockSeconds}
        />
        <span class="suffix">seconds</span>
      </div>
      <p class="help">How long YouTube stays blocked after your watch time ends.</p>
    </div>
  </div>

  <div class="actions">
    <button class="button" type="button" disabled aria-disabled="true">Save</button>
    <span class="hint">Design only (logic not wired yet)</span>
  </div>
</section>

<style>
  .card {
    background: var(--surface);
    border: 1px solid color-mix(in srgb, var(--border) 80%, transparent);
    border-radius: var(--radius-lg);
    padding: 14px;
    box-shadow: var(--shadow-sm);
  }

  .cardHeader {
    display: grid;
    gap: 4px;
    margin-bottom: 12px;
  }

  .title {
    margin: 0;
    font-size: 14px;
    font-weight: 650;
    letter-spacing: 0.2px;
    color: var(--text);
  }

  .subtitle {
    margin: 0;
    font-size: 12px;
    line-height: 1.35;
    color: var(--muted);
  }

  .fields {
    display: grid;
    gap: 12px;
  }

  .field {
    display: grid;
    gap: 6px;
  }

  .label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text);
  }

  .control {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 10px;
    padding: 10px 10px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: color-mix(in srgb, var(--surface) 82%, var(--bg));
  }

  .input {
    width: 100%;
    border: 0;
    outline: none;
    background: transparent;
    color: var(--text);
    font-size: 14px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  .suffix {
    font-size: 12px;
    color: var(--muted);
    padding-left: 10px;
    border-left: 1px solid color-mix(in srgb, var(--border) 75%, transparent);
    white-space: nowrap;
  }

  .help {
    margin: 0;
    font-size: 11px;
    line-height: 1.35;
    color: var(--muted);
  }

  .divider {
    height: 1px;
    background: color-mix(in srgb, var(--border) 65%, transparent);
  }

  .actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid color-mix(in srgb, var(--border) 65%, transparent);
  }

  .button {
    appearance: none;
    border: 1px solid color-mix(in srgb, var(--accent) 65%, var(--border));
    background: color-mix(in srgb, var(--accent) 14%, var(--surface));
    color: color-mix(in srgb, var(--accent) 85%, var(--text));
    border-radius: 999px;
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 650;
    letter-spacing: 0.2px;
    cursor: not-allowed;
    opacity: 0.75;
  }

  .hint {
    font-size: 11px;
    color: var(--muted);
    white-space: nowrap;
  }
</style>
