import { clockLock } from './lib/instance';

type TrackTimeMessage = {
  type: 'TRACK_TIME';
  payload: { domain: string; delta: number };
};

type GetStatusMessage = {
  type: 'GET_STATUS';
  payload: { domain: string };
};

type Message = TrackTimeMessage | GetStatusMessage;

// Initialize the app state in background context
clockLock.init().catch(console.error);

// Sync rules when they change in other contexts (e.g. Popup)
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.rules) {
    // Reload everything to be safe or just rules
    void clockLock.init();
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message: unknown, sender, sendResponse) => {
  console.log(`[ClockLock] Received message from ${sender.tab?.url}:`, message);
  
  const msg = message as Message;
  
  if (msg.type === 'TRACK_TIME') {
    const { domain, delta } = msg.payload;
    console.log(`[ClockLock] Received TRACK_TIME message from ${domain}...`);

    clockLock
      .trackTime(domain, delta)
      .then((result) => {
        const cooldownRemaining = clockLock.getCooldownRemaining(domain);
        sendResponse({ ...result, cooldownRemaining });
      })
      .catch((err: Error) => {
        console.error(err);
        sendResponse({ blocked: false, error: err.message });
      });

    return true; // Keep channel open for async response
  }

  if (msg.type === 'GET_STATUS') {
    console.log(`[ClockLock] Received GET_STATUS message from ${msg.payload.domain}...`);
    const { domain } = msg.payload;
    const blocked = clockLock.isBlocked(domain);
    const cooldownRemaining = clockLock.getCooldownRemaining(domain);
    const rule = clockLock.getRule(domain);
    const trackInBackground = rule?.trackInBackground ?? false;
    sendResponse({ blocked, cooldownRemaining, trackInBackground });
    return false;
  }
});
