import type { Storage } from './storage';
import type { AppState, Rule } from './types';

export class ClockLock {
  private storage: Storage;
  private state: AppState;

  constructor(storage: Storage) {
    this.storage = storage;
    this.state = { rules: [], siteStates: {} };
  }

  async init() {
    this.state = await this.storage.load();

    // Add default rule for YouTube if it doesn't exist
    if (!this.getRule('youtube.com')) {
      await this.addRule({
        domain: 'youtube.com',
        timeLimit: 0,
        cooldownDuration: 0,
        trackInBackground: false,
      });
    }
  }

  get rules() {
    return this.state.rules;
  }

  async addRule(rule: Rule) {
    this.state.rules = this.state.rules.filter((r) => r.domain !== rule.domain);
    this.state.rules.push(rule);
    await this.saveRules();
  }

  async removeRule(domain: string) {
    this.state.rules = this.state.rules.filter((r) => r.domain !== domain);
    await this.saveRules();
  }

  getRule(domain: string): Rule | undefined {
    return this.state.rules.find((r) => r.domain === domain);
  }

  async trackTime(domain: string, deltaMilliseconds: number): Promise<{ blocked: boolean }> {
    console.log(`[ClockLock] Tracking time for ${domain}...`);
    const rule = this.getRule(domain);
    if (!rule) {
      console.log(`[ClockLock] No rule found for domain: ${domain}`);
      return {
        blocked: false,
      };
    }

    if (!this.state.siteStates[domain]) {
      this.state.siteStates[domain] = {
        timeSpent: 0,
        lastBlocked: null,
      };
    }

    const siteState = this.state.siteStates[domain];

    if (this.isBlocked(domain)) {
      console.log(`[ClockLock] Domain ${domain} is blocked`);
      return { blocked: true };
    }

    // If we were blocked but isBlocked() is now false, it means cooldown expired.
    if (siteState.lastBlocked !== null) {
      this.reset(domain);
    }

    siteState.timeSpent += deltaMilliseconds;
    console.log(`[ClockLock] Tracked time for ${domain}: ${siteState.timeSpent}ms`);

    let blocked = false;
    if (siteState.timeSpent >= rule.timeLimit && rule.cooldownDuration > 0) {
      this.block(domain);
      blocked = true;
    }

    await this.saveSiteStates();
    return { blocked };
  }

  private block(domain: string) {
    const siteState = this.state.siteStates[domain];
    if (siteState) {
      siteState.lastBlocked = Date.now();
    }
  }

  private reset(domain: string) {
    const siteState = this.state.siteStates[domain];
    if (siteState) {
      siteState.lastBlocked = null;
      siteState.timeSpent = 0;
    }
  }

  isBlocked(domain: string): boolean {
    const siteState = this.state.siteStates[domain];
    if (!siteState || siteState.lastBlocked === null) return false;

    const rule = this.getRule(domain);
    if (!rule) return false;

    const now = Date.now();
    const cooldownEnds = siteState.lastBlocked + rule.cooldownDuration;

    if (rule.cooldownDuration == 0) {
      return false;
    }

    return now < cooldownEnds;
  }

  getCooldownRemaining(domain: string): number {
    const siteState = this.state.siteStates[domain];
    if (!siteState || siteState.lastBlocked === null) return 0;

    const rule = this.getRule(domain);
    if (!rule) return 0;

    return Math.max(0, siteState.lastBlocked + rule.cooldownDuration - Date.now());
  }

  getTimeLeft(domain: string): number {
    const rule = this.getRule(domain);
    if (!rule) return Infinity;

    const siteState = this.state.siteStates[domain];
    if (!siteState) return rule.timeLimit;

    return Math.max(0, rule.timeLimit - siteState.timeSpent);
  }

  // Helper to ensure state consistency (e.g. for UI)
  async syncState(domain: string) {
    const rule = this.getRule(domain);
    if (!rule) return;

    if (!this.isBlocked(domain) && this.state.siteStates[domain]?.lastBlocked !== null) {
      this.reset(domain);
      await this.saveSiteStates();
    }
  }

  private async saveRules() {
    await this.storage.saveRules(this.state.rules);
  }

  private async saveSiteStates() {
    await this.storage.saveSiteStates(this.state.siteStates);
  }
}
