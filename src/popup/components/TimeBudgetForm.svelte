<script lang="ts">
  type SiteConfig = {
    id: string;
    label: string;
    watchSeconds: number;
    blockSeconds: number;
  };

  let sites: SiteConfig[] = [
    { id: 'youtube.com', label: 'youtube.com', watchSeconds: 600, blockSeconds: 1800 },
    { id: 'tiktok.com', label: 'tiktok.com', watchSeconds: 300, blockSeconds: 1200 },
  ];

  let selectedId: string = sites[0]?.id ?? '';

  let isAdding = false;
  let newSiteLabel = '';

  $: selectedIndex = sites.findIndex((s) => s.id === selectedId);
  $: selectedSite = selectedIndex === -1 ? undefined : sites[selectedIndex];

  function startAdd() {
    isAdding = true;
    newSiteLabel = '';
  }

  function cancelAdd() {
    isAdding = false;
    newSiteLabel = '';
  }

  function addSite() {
    const trimmed = newSiteLabel.trim();
    if (!trimmed) return;

    const id = trimmed.toLowerCase();
    if (sites.some((s) => s.id === id)) {
      selectedId = id;
      cancelAdd();
      return;
    }

    sites = [...sites, { id, label: trimmed, watchSeconds: 600, blockSeconds: 1800 }];
    selectedId = id;
    cancelAdd();
  }
</script>

<section class="card" aria-label="Time settings">
  <div class="cardHeader">
    <h2 class="title">Time limits</h2>
    <p class="subtitle">Pick a site, then set watch time + block duration.</p>
  </div>

  <div class="siteRow" aria-label="Site selector">
    <div class="siteSelect">
      <label class="label" for="site">Site</label>
      <div class="selectWrap">
        <select id="site" class="select" bind:value={selectedId}>
          {#each sites as site}
            <option value={site.id}>{site.label}</option>
          {/each}
        </select>
        <span class="chevron" aria-hidden="true">▾</span>
      </div>
    </div>

    <button class="iconButton" type="button" on:click={startAdd} aria-label="Add new site">
      +
    </button>
  </div>

  {#if isAdding}
    <div class="addRow" aria-label="Add new site">
      <div class="addField">
        <label class="label" for="newSite">New site</label>
        <input
          id="newSite"
          class="textInput"
          placeholder="example.com"
          autocomplete="off"
          spellcheck="false"
          bind:value={newSiteLabel}
          on:keydown={(e) => e.key === 'Enter' && addSite()}
        />
      </div>

      <div class="addActions">
        <button class="smallButton" type="button" on:click={addSite}>Add</button>
        <button class="smallButton secondary" type="button" on:click={cancelAdd}>Cancel</button>
      </div>
    </div>
  {/if}

  <div class="fields">
    {#if selectedIndex !== -1}
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
            bind:value={sites[selectedIndex].watchSeconds}
          />
          <span class="suffix">seconds</span>
        </div>
        <p class="help">When this runs out, the selected site gets blocked.</p>
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
            bind:value={sites[selectedIndex].blockSeconds}
          />
          <span class="suffix">seconds</span>
        </div>
        <p class="help">How long the site stays blocked after your watch time ends.</p>
      </div>
    {:else}
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
            value={0}
            disabled
          />
          <span class="suffix">seconds</span>
        </div>
        <p class="help">Select a site to edit its limits.</p>
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
            value={0}
            disabled
          />
          <span class="suffix">seconds</span>
        </div>
        <p class="help">Select a site to edit its limits.</p>
      </div>
    {/if}
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

  .siteRow {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
    gap: 10px;
    margin-bottom: 12px;
  }

  .siteSelect {
    display: grid;
    gap: 6px;
    min-width: 0;
  }

  .selectWrap {
    position: relative;
  }

  .select {
    width: 100%;
    min-width: 0;
    appearance: none;
    border: 1px solid var(--border);
    background: color-mix(in srgb, var(--surface) 82%, var(--bg));
    color: var(--text);
    border-radius: var(--radius-md);
    padding: 10px 34px 10px 10px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    outline: none;
  }

  .chevron {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
    color: var(--muted);
    pointer-events: none;
  }

  .iconButton {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    border: 1px solid color-mix(in srgb, var(--border) 80%, transparent);
    background: color-mix(in srgb, var(--accent) 14%, var(--surface));
    color: color-mix(in srgb, var(--accent) 90%, var(--text));
    font-size: 18px;
    line-height: 1;
    font-weight: 700;
    cursor: pointer;
  }

  .iconButton:hover {
    background: color-mix(in srgb, var(--accent) 20%, var(--surface));
  }

  .addRow {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px;
    align-items: end;
    margin: 2px 0 12px 0;
    padding: 10px;
    border-radius: var(--radius-lg);
    border: 1px dashed color-mix(in srgb, var(--border) 80%, transparent);
    background: color-mix(in srgb, var(--surface) 74%, var(--bg));
  }

  .addField {
    display: grid;
    gap: 6px;
    min-width: 0;
  }

  .textInput {
    width: 100%;
    min-width: 0;
    border: 1px solid var(--border);
    background: color-mix(in srgb, var(--surface) 82%, var(--bg));
    color: var(--text);
    border-radius: var(--radius-md);
    padding: 10px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    outline: none;
  }

  .textInput::placeholder {
    color: color-mix(in srgb, var(--muted) 70%, transparent);
    font-weight: 600;
  }

  .addActions {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .smallButton {
    appearance: none;
    border: 1px solid color-mix(in srgb, var(--border) 85%, transparent);
    background: color-mix(in srgb, var(--surface) 75%, var(--bg));
    color: var(--text);
    border-radius: 999px;
    padding: 8px 10px;
    font-size: 12px;
    font-weight: 650;
    cursor: pointer;
    white-space: nowrap;
  }

  @media (max-width: 360px) {
    .addRow {
      grid-template-columns: 1fr;
      align-items: stretch;
    }

    .addActions {
      justify-content: flex-end;
    }
  }

  .smallButton.secondary {
    background: transparent;
    color: var(--muted);
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
