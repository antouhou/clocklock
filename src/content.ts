// No imports! This script must be self-contained or use dynamic imports.
// But we won't use dynamic imports to keep things simple and robust across browsers.

const domain = window.location.hostname.replace(/^www\./, '');
const CHECK_INTERVAL_MS = 1000;
let isBlocked = false;

// Initial check
checkStatus();

// Start loop
setInterval(() => {
    if (document.hidden) return;
    
    if (isBlocked) {
        checkStatus();
    } else {
        trackTime();
    }
}, CHECK_INTERVAL_MS);

function trackTime() {
    try {
        // @ts-ignore
        chrome.runtime.sendMessage({ 
            type: 'TRACK_TIME', 
            payload: { domain, delta: CHECK_INTERVAL_MS } 
        }, (response) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                // Background might be waking up
                return;
            }
            if (response && response.blocked) {
                blockSite();
            }
        });
    } catch (e) {
        console.error(e);
        // Extension Context invalidated etc.
    }
}

function checkStatus() {
    try {
        // @ts-ignore
        chrome.runtime.sendMessage({ 
            type: 'GET_STATUS', 
            payload: { domain } 
        }, (response) => {
            if (chrome.runtime.lastError) return;
            
            if (response && response.blocked) {
                blockSite();
            } else if (isBlocked) {
                // Was blocked, now unblocked
                window.location.reload();
            }
        });
    } catch (e) {
        console.error(e);
        // Context invalidated
    }
}

function blockSite() {
    if (document.body.getAttribute('data-clocklock-blocked') === 'true') {
        isBlocked = true;
        return;
    }

    // Inject shared design tokens
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        :root {
            --bg: #0b0e11;
            --surface: #181a20;
            --surface-2: #1e2329;
            --text: #eaecef;
            --muted: #848e9c;
            --border: #2b3139;
            --accent: #f0b90b;
            --on-accent: #111827;
            --radius-lg: 14px;
            --radius-md: 12px;
            --shadow-sm: 0 10px 28px rgba(0, 0, 0, 0.32);
            --space-1: 6px;
            --space-2: 10px;
            --space-3: 14px;
        }
    `;

    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: var(--bg);
        color: var(--text);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: calc(var(--space-2) * 1.5);
        z-index: 2147483647;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    `;

    const heading = document.createElement('h1');
    heading.textContent = "⏱️ Time's up!";
    heading.style.cssText = `
        margin: 0;
        font-size: 2rem;
        font-weight: 750;
        letter-spacing: 0.2px;
        color: var(--accent);
    `;
    
    const text = document.createElement('p');
    text.textContent = `You've reached your limit for ${domain}. Take a break!`;
    text.style.cssText = `
        margin: 0;
        font-size: 1rem;
        color: var(--muted);
        text-align: center;
        max-width: 400px;
        line-height: 1.5;
    `;
    
    container.appendChild(heading);
    container.appendChild(text);

    document.head.appendChild(styleSheet);
    document.body.innerHTML = '';
    document.body.appendChild(container);
    document.body.setAttribute('data-clocklock-blocked', 'true');
    isBlocked = true;
    
    document.querySelectorAll('video').forEach(v => v.pause());
    document.querySelectorAll('audio').forEach(a => a.pause());
}
