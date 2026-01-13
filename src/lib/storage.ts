import type { AppState, Rule, SiteState } from './types.js';

export interface Storage {
  load(): Promise<AppState>;
  saveRules(rules: Rule[]): Promise<void>;
  saveSiteStates(siteStates: Record<string, SiteState>): Promise<void>;
}

export class InMemoryStorage implements Storage {
  private state: AppState = { rules: [], siteStates: {} };

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
}
