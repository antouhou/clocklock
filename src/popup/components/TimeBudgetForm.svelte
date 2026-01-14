<script lang="ts">
  import { onMount } from 'svelte';
  import { clockLock, storage } from '../../lib/instance.js';
  import type { Rule } from '../../lib/types.js';

  type SiteConfig = {
    id: string;
    label: string;
    watchSeconds: number;
    blockSeconds: number;
    trackInBackground: boolean;
  };

  let sites: SiteConfig[] = [];
  let selectedId: string = '';

  onMount(async () => {
    await clockLock.init();
    refreshSites();

    // Load the previously selected site
    const savedSelectedSite = await storage.loadSelectedSite();
    if (savedSelectedSite && sites.some((s) => s.id === savedSelectedSite)) {
      selectedId = savedSelectedSite;
    } else if (sites.length > 0) {
      selectedId = sites[0].id;
    }
  });

  function refreshSites() {
    sites = clockLock.rules.map((r) => ({
      id: r.domain,
      label: r.domain,
      watchSeconds: Math.floor(r.timeLimit / 1000),
      blockSeconds: Math.floor(r.cooldownDuration / 1000),
      trackInBackground: r.trackInBackground,
    }));
  }

  let isAdding = false;
  let newSiteLabel = '';
  let watchUnit: 'seconds' | 'minutes' | 'hours' = 'minutes';
  let blockUnit: 'seconds' | 'minutes' | 'hours' = 'minutes';

  $: selectedIndex = sites.findIndex((s) => s.id === selectedId);

  // Save the selected site whenever it changes
  $: if (selectedId) {
    storage.saveSelectedSite(selectedId);
  }

  function convertFromSeconds(seconds: number, unit: 'seconds' | 'minutes' | 'hours'): number {
    if (unit === 'minutes') return Math.round((seconds / 60) * 100) / 100;
    if (unit === 'hours') return Math.round((seconds / 3600) * 100) / 100;
    return seconds;
  }

  function convertToSeconds(value: number, unit: 'seconds' | 'minutes' | 'hours'): number {
    if (unit === 'minutes') return Math.round(value * 60);
    if (unit === 'hours') return Math.round(value * 3600);
    return Math.round(value);
  }

  $: watchDisplayValue =
    selectedIndex !== -1 ? convertFromSeconds(sites[selectedIndex].watchSeconds, watchUnit) : 0;
  $: blockDisplayValue =
    selectedIndex !== -1 ? convertFromSeconds(sites[selectedIndex].blockSeconds, blockUnit) : 0;

  function updateWatchSeconds(value: number) {
    if (selectedIndex !== -1) {
      sites[selectedIndex].watchSeconds = convertToSeconds(value, watchUnit);
    }
  }

  function updateBlockSeconds(value: number) {
    if (selectedIndex !== -1) {
      sites[selectedIndex].blockSeconds = convertToSeconds(value, blockUnit);
    }
  }

  function startAdd() {
    isAdding = true;
    newSiteLabel = '';
  }

  function cancelAdd() {
    isAdding = false;
    newSiteLabel = '';
  }

  async function addSite() {
    const trimmed = newSiteLabel.trim();
    if (!trimmed) return;

    const id = trimmed.toLowerCase();

    // Check if exists in current UI list (which mirrors storage)
    if (sites.some((s) => s.id === id)) {
      selectedId = id;
      cancelAdd();
      return;
    }

    const newRule: Rule = {
      domain: id,
      timeLimit: 600 * 1000,
      cooldownDuration: 1800 * 1000,
      trackInBackground: false,
    };

    await clockLock.addRule(newRule);
    refreshSites();
    selectedId = id;
    cancelAdd();
  }

  async function saveChanges() {
    if (selectedIndex === -1) return;
    const site = sites[selectedIndex];

    const rule: Rule = {
      domain: site.id,
      timeLimit: site.watchSeconds * 1000,
      cooldownDuration: site.blockSeconds * 1000,
      trackInBackground: site.trackInBackground,
    };

    await clockLock.addRule(rule);
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
            step="any"
            inputmode="decimal"
            value={watchDisplayValue}
            on:input={(e) => updateWatchSeconds(parseFloat(e.currentTarget.value) || 0)}
          />
          <div class="unitSelectWrap">
            <select class="unitSelect" bind:value={watchUnit}>
              <option value="seconds">seconds</option>
              <option value="minutes">minutes</option>
              <option value="hours">hours</option>
            </select>
            <span class="unitChevron" aria-hidden="true">▾</span>
          </div>
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
            step="any"
            inputmode="decimal"
            value={blockDisplayValue}
            on:input={(e) => updateBlockSeconds(parseFloat(e.currentTarget.value) || 0)}
          />
          <div class="unitSelectWrap">
            <select class="unitSelect" bind:value={blockUnit}>
              <option value="seconds">seconds</option>
              <option value="minutes">minutes</option>
              <option value="hours">hours</option>
            </select>
            <span class="unitChevron" aria-hidden="true">▾</span>
          </div>
        </div>
        <p class="help">
          How long the site stays blocked after your watch time ends. Set 0 to disable.
        </p>
      </div>

      <div class="divider" role="separator" aria-hidden="true"></div>

      <div class="field">
        <label class="checkboxLabel">
          <input
            type="checkbox"
            class="checkbox"
            bind:checked={sites[selectedIndex].trackInBackground}
          />
          <span class="checkboxText">Track time in background tabs</span>
        </label>
        <p class="help">When enabled, time will be tracked even when the tab is not active.</p>
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

      <div class="divider" role="separator" aria-hidden="true"></div>

      <div class="field">
        <label class="checkboxLabel">
          <input type="checkbox" class="checkbox" disabled checked={false} />
          <span class="checkboxText">Track time in background tabs</span>
        </label>
        <p class="help">Select a site to edit its limits.</p>
      </div>
    {/if}
  </div>

  <div class="actions">
    <button class="button" type="button" on:click={saveChanges} disabled={selectedIndex === -1}
      >Save</button
    >
  </div>
</section>

<style>
  .card {
    background: var(--surface);
    border: 1px solid color-mix(in srgb, var(--border) 92%, transparent);
    border-radius: var(--radius-lg);
    padding: var(--space-3);
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
    background: var(--surface-2);
    color: var(--text);
    border-radius: var(--radius-md);
    padding: 10px 34px 10px 10px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    outline: none;
  }

  .select:hover {
    border-color: color-mix(in srgb, var(--accent) 30%, var(--border));
  }

  .chevron {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    color: var(--muted);
    pointer-events: none;
    line-height: 1;
  }

  .iconButton {
    width: 38px;
    height: 38px;
    border-radius: var(--radius-md);
    border: 1px solid color-mix(in srgb, var(--accent) 55%, var(--border));
    background: var(--accent);
    color: var(--on-accent);
    font-size: 18px;
    line-height: 1;
    font-weight: 700;
    cursor: pointer;
  }

  .iconButton:hover {
    background: color-mix(in srgb, var(--accent) 88%, white);
  }

  .addRow {
    display: grid;
    gap: 10px;
    align-items: stretch;
    margin: 2px 0 12px 0;
    padding: var(--space-2);
    border-radius: var(--radius-lg);
    border: 1px dashed color-mix(in srgb, var(--border) 80%, transparent);
    background: var(--surface-2);
  }

  .addField {
    display: grid;
    gap: 6px;
    min-width: 0;
  }

  .textInput {
    min-width: 0;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    border-radius: var(--radius-md);
    padding: 10px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    outline: none;
  }

  .textInput:hover {
    border-color: color-mix(in srgb, var(--accent) 30%, var(--border));
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
    border: 1px solid color-mix(in srgb, var(--accent) 55%, var(--border));
    background: var(--accent);
    color: var(--on-accent);
    border-radius: var(--radius-md);
    padding: 8px 10px;
    font-size: 12px;
    font-weight: 650;
    cursor: pointer;
    white-space: nowrap;
  }

  .smallButton:hover {
    background: color-mix(in srgb, var(--accent) 86%, white);
  }

  .smallButton.secondary {
    border: 1px solid var(--border);
    background: color-mix(in srgb, var(--surface) 55%, var(--bg));
    color: var(--text);
  }

  .smallButton.secondary:hover {
    border-color: color-mix(in srgb, var(--accent) 30%, var(--border));
    background: color-mix(in srgb, var(--surface) 72%, var(--bg));
  }

  .field {
    display: grid;
    gap: 6px;
  }

  .label {
    font-size: 12px;
    font-weight: 600;
    color: var(--muted);
  }

  .control {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 10px;
    padding: 10px 10px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: var(--surface-2);
  }

  .control:hover {
    border-color: color-mix(in srgb, var(--accent) 30%, var(--border));
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

  .unitSelectWrap {
    position: relative;
    padding-left: 10px;
    border-left: 1px solid color-mix(in srgb, var(--border) 75%, transparent);
  }

  .unitSelect {
    appearance: none;
    border: 0;
    outline: none;
    background: transparent;
    color: var(--text);
    font-size: 12px;
    font-weight: 600;
    padding-right: 18px;
    cursor: pointer;
    white-space: nowrap;
  }

  .unitSelect:hover {
    color: var(--accent);
  }

  .unitChevron {
    position: absolute;
    right: 2px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
    color: var(--muted);
    pointer-events: none;
    line-height: 1;
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
    border: 1px solid color-mix(in srgb, var(--accent) 55%, var(--border));
    background: var(--accent);
    color: var(--on-accent);
    border-radius: var(--radius-md);
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 650;
    letter-spacing: 0.2px;
    cursor: pointer;
  }

  .button:hover:not(:disabled) {
    background: color-mix(in srgb, var(--accent) 88%, white);
  }

  .button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    border: 1px solid color-mix(in srgb, var(--border) 95%, transparent);
    background: color-mix(in srgb, var(--surface) 65%, var(--bg));
    color: var(--muted);
  }

  .checkboxLabel {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    user-select: none;
  }

  .checkbox {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid var(--border);
    border-radius: 6px;
    background: var(--surface-2);
    cursor: pointer;
    position: relative;
    flex-shrink: 0;
  }

  .checkbox:hover {
    border-color: color-mix(in srgb, var(--accent) 50%, var(--border));
  }

  .checkbox:checked {
    background: var(--accent);
    border-color: var(--accent);
  }

  .checkbox:checked::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--on-accent);
    font-size: 14px;
    font-weight: 700;
  }

  .checkbox:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .checkboxText {
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
  }
</style>
