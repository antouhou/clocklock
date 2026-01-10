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

    async load(): Promise<AppState> {
        return structuredClone(this.state);
    }

    async saveRules(rules: Rule[]): Promise<void> {
        this.state.rules = structuredClone(rules);
    }

    async saveSiteStates(siteStates: Record<string, SiteState>): Promise<void> {
        this.state.siteStates = structuredClone(siteStates);
    }
}

export class BrowserStorage implements Storage {
  async load(): Promise<AppState> {
    // @ts-ignore - chrome is not defined in test env
    const result = await chrome.storage.local.get(['rules', 'siteStates']);
    return {
      rules: result.rules || [],
      siteStates: result.siteStates || {}
    };
  }

  async saveRules(rules: Rule[]): Promise<void> {
    // @ts-ignore
    await chrome.storage.local.set({ rules });
  }

  async saveSiteStates(siteStates: Record<string, SiteState>): Promise<void> {
    // @ts-ignore
    await chrome.storage.local.set({ siteStates });
  }
}
