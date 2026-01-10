// Singleton instance for the app
import { ClockLock } from './clocklock.js';
import { BrowserStorage } from './storage.js';

export const storage = new BrowserStorage();
export const clockLock = new ClockLock(storage);
