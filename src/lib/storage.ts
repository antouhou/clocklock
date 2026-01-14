import type { AppState, Rule, SiteState } from './types.js';

export interface Storage {
  load(): Promise<AppState>;
  saveRules(rules: Rule[]): Promise<void>;
  saveSiteStates(siteStates: Record<string, SiteState>): Promise<void>;
  saveSelectedSite(siteId: string): Promise<void>;
  loadSelectedSite(): Promise<string | null>;
}

export class InMemoryStorage implements Storage {
  private state: AppState = { rules: [], siteStates: {} };
  private selectedSite: string | null = null;

  constructor(initialState?: AppState) {
    if (initialState) {
      this.state = structuredClone(initialState);
    }
  }

  load(): Promise<AppState> {
    return Promise.resolve(structuredClone(this.state));
  }

  saveRules(rules: Rule[]): Promise<void> {
    this.state.rules = structuredClone(rules);
    return Promise.resolve();
  }

  saveSiteStates(siteStates: Record<string, SiteState>): Promise<void> {
    this.state.siteStates = structuredClone(siteStates);
    return Promise.resolve();
  }

  saveSelectedSite(siteId: string): Promise<void> {
    this.selectedSite = siteId;
    return Promise.resolve();
  }

  loadSelectedSite(): Promise<string | null> {
    return Promise.resolve(this.selectedSite);
  }
}

export class BrowserStorage implements Storage {
  async load(): Promise<AppState> {
    const result = await chrome.storage.local.get(['rules', 'siteStates']);
    return {
      rules: (result.rules as Rule[] | undefined) ?? [],
      siteStates: (result.siteStates as Record<string, SiteState> | undefined) ?? {},
    };
  }

  async saveRules(rules: Rule[]): Promise<void> {
    await chrome.storage.local.set({ rules });
  }

  async saveSiteStates(siteStates: Record<string, SiteState>): Promise<void> {
    await chrome.storage.local.set({ siteStates });
  }

  async saveSelectedSite(siteId: string): Promise<void> {
    await chrome.storage.local.set({ selectedSite: siteId });
  }

  async loadSelectedSite(): Promise<string | null> {
    const result = await chrome.storage.local.get(['selectedSite']);
    return (result.selectedSite as string | undefined) ?? null;
  }
}
