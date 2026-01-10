import { clockLock } from './lib/instance';

// Initialize the app state in background context
clockLock.init().catch(console.error);

// Sync rules when they change in other contexts (e.g. Popup)
// @ts-ignore
chrome.storage.onChanged.addListener(async (changes, area) => {
    if (area === 'local' && changes.rules) {
        // Reload everything to be safe or just rules
        await clockLock.init();
    }
});

// Listen for messages from content scripts
// @ts-ignore
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(`[ClockLock] Received message from ${sender.tab?.url}:`, message);
    if (message.type === 'TRACK_TIME') {
        const { domain, delta } = message.payload;
        console.log(`[ClockLock] Received TRACK_TIME message from ${domain}...`);
        
        clockLock.trackTime(domain, delta)
            .then(result => sendResponse(result))
            .catch(err => {
                console.error(err);
                sendResponse({ blocked: false, error: err.message });
            });
            
        return true; // Keep channel open for async response
    }

    if (message.type === 'GET_STATUS') {
        console.log(`[ClockLock] Received GET_STATUS message from ${message.payload.domain}...`);
        const { domain } = message.payload;
        const blocked = clockLock.isBlocked(domain);
        sendResponse({ blocked });
        return false;
    }
});
