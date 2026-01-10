import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ClockLock } from './clocklock';
import { InMemoryStorage } from './storage';

describe('ClockLock', () => {
  let clockLock: ClockLock;
  let storage: InMemoryStorage;

  beforeEach(async () => {
    storage = new InMemoryStorage();
    clockLock = new ClockLock(storage);
    await clockLock.init();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should add a rule', async () => {
    await clockLock.addRule({ domain: 'youtube.com', timeLimit: 1000, cooldownDuration: 5000, trackInBackground: false });
    expect(clockLock.getRule('youtube.com')).toBeDefined();
    expect(clockLock.getRule('youtube.com')?.timeLimit).toBe(1000);
  });

  it('should track time and block when limit reached', async () => {
    await clockLock.addRule({ domain: 'youtube.com', timeLimit: 1000, cooldownDuration: 5000, trackInBackground: false });
    
    // Track 500ms
    let result = await clockLock.trackTime('youtube.com', 500);
    expect(result.blocked).toBe(false);
    expect(clockLock.getTimeLeft('youtube.com')).toBe(500);

    // Track another 500ms -> should block
    result = await clockLock.trackTime('youtube.com', 500);
    expect(result.blocked).toBe(true);
    expect(clockLock.isBlocked('youtube.com')).toBe(true);
  });

  it('should stay blocked during cooldown', async () => {
    await clockLock.addRule({ domain: 'youtube.com', timeLimit: 1000, cooldownDuration: 5000, trackInBackground: false });
    await clockLock.trackTime('youtube.com', 1000); // Block it
    
    expect(clockLock.isBlocked('youtube.com')).toBe(true);

    // Advance time by 4s (less than cooldown)
    vi.advanceTimersByTime(4000);
    expect(clockLock.isBlocked('youtube.com')).toBe(true);
    expect(clockLock.getCooldownRemaining('youtube.com')).toBe(1000);
  });

  it('should unblock and reset after cooldown', async () => {
    await clockLock.addRule({ domain: 'youtube.com', timeLimit: 1000, cooldownDuration: 5000, trackInBackground: false });
    await clockLock.trackTime('youtube.com', 1000); // Block it
    
    // Advance time by 5001ms (more than cooldown)
    vi.advanceTimersByTime(5001);
    
    expect(clockLock.isBlocked('youtube.com')).toBe(false);
    
    // Trigger state update/check via trackTime or syncState
    // If user tries to visit again:
    const result = await clockLock.trackTime('youtube.com', 100);
    expect(result.blocked).toBe(false);
    
    // Check if timers reset
    expect(clockLock.getTimeLeft('youtube.com')).toBe(900); // 1000 - 100
  });
  
  it('should persist rules and state', async () => {
      await clockLock.addRule({ domain: 'youtube.com', timeLimit: 1000, cooldownDuration: 5000, trackInBackground: false });
      await clockLock.trackTime('youtube.com', 500);
      
      // Create new instance with same storage
      const newClockLock = new ClockLock(storage);
      await newClockLock.init();
      
      expect(newClockLock.getRule('youtube.com')).toBeDefined();
      expect(newClockLock.getTimeLeft('youtube.com')).toBe(500);
  });

  it('should not block when cooldownDuration is 0', async () => {
    await clockLock.addRule({ domain: 'youtube.com', timeLimit: 1000, cooldownDuration: 0, trackInBackground: false });
    
    // Track 1000ms (reaching the limit)
    let result = await clockLock.trackTime('youtube.com', 1000);
    expect(result.blocked).toBe(false);
    expect(clockLock.isBlocked('youtube.com')).toBe(false);
    
    // Continue tracking beyond the limit
    result = await clockLock.trackTime('youtube.com', 500);
    expect(result.blocked).toBe(false);
    expect(clockLock.isBlocked('youtube.com')).toBe(false);
  });
});
