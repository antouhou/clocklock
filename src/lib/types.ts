export interface Rule {
  domain: string;
  timeLimit: number; // in milliseconds
  cooldownDuration: number; // in milliseconds
  trackInBackground: boolean; // whether to track time when tab is in background
}

export interface SiteState {
  timeSpent: number; // in milliseconds
  lastBlocked: number | null; // blocked timestamp, null if not blocked
}

export interface AppState {
  rules: Rule[];
  siteStates: Record<string, SiteState>;
}
