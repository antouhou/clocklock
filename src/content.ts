// No imports! This script must be self-contained or use dynamic imports.
// But we won't use dynamic imports to keep things simple and robust across browsers.

type TrackTimeResponse = {
  blocked: boolean;
  cooldownRemaining?: number;
  error?: string;
};

type GetStatusResponse = {
  blocked: boolean;
  cooldownRemaining?: number;
  trackInBackground?: boolean;
};

const domain = window.location.hostname.replace(/^www\./, '');
const CHECK_INTERVAL_MS = 1000;
let isBlocked = false;
let trackInBackground = false; // Will be fetched from rule

// Initial check
checkStatus();

// Start loop
setInterval(() => {
  // Skip if page is hidden and we shouldn't track background
  if (document.hidden && !trackInBackground) return;

  if (isBlocked) {
    checkStatus();
  } else {
    trackTime();
  }
}, CHECK_INTERVAL_MS);

function trackTime() {
  try {
    chrome.runtime.sendMessage(
      {
        type: 'TRACK_TIME',
        payload: { domain, delta: CHECK_INTERVAL_MS },
      },
      (response: TrackTimeResponse) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          // Background might be waking up
          return;
        }
        if (response?.blocked) {
          blockSite(response.cooldownRemaining ?? 0);
        }
      }
    );
  } catch (e) {
    console.error(e);
    // Extension Context invalidated etc.
  }
}

function checkStatus() {
  try {
    chrome.runtime.sendMessage(
      {
        type: 'GET_STATUS',
        payload: { domain },
      },
      (response: GetStatusResponse) => {
        if (chrome.runtime.lastError) return;

        if (response?.blocked) {
          blockSite(response.cooldownRemaining ?? 0);
        } else if (isBlocked) {
          // Was blocked, now unblocked
          window.location.reload();
        }

        // Update trackInBackground setting from rule
        if (response?.trackInBackground !== undefined) {
          trackInBackground = response.trackInBackground;
        }
      }
    );
  } catch (e) {
    console.error(e);
    // Context invalidated
  }
}

function blockSite(cooldownRemaining = 0) {
  if (document.body.getAttribute('data-clocklock-blocked') === 'true') {
    isBlocked = true;
    // Update existing timer if present
    const existingTimer = document.getElementById('clocklock-timer');
    if (existingTimer && cooldownRemaining > 0) {
      existingTimer.textContent = formatTime(cooldownRemaining);
    }
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

  const timer = document.createElement('div');
  timer.id = 'clocklock-timer';
  timer.textContent = formatTime(cooldownRemaining);
  timer.style.cssText = `
        margin-top: calc(var(--space-2) * 2);
        font-size: 3rem;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
        color: var(--text);
        letter-spacing: 0.05em;
    `;

  const footer = document.createElement('div');
  footer.style.cssText = `
        position: absolute;
        bottom: calc(var(--space-3) * 2);
        left: 50%;
        transform: translateX(-50%);
        max-width: 500px;
        padding: 0 calc(var(--space-2) * 2);
    `;

  const footerText = document.createElement('p');
  footerText.style.cssText = `
        margin: 0;
        font-size: 0.875rem;
        line-height: 1.5;
        color: var(--muted);
        text-align: center;
    `;
  footerText.innerHTML = `
        ClockLock is free and open source. If you found it useful, you can support it with a small donation on
        <a href="https://github.com/sponsors/antouhou" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: none; font-weight: 600;">GitHub</a>
        or
        <a href="https://patreon.com/antouhou" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: none; font-weight: 600;">Patreon</a>.
    `;

  footer.appendChild(footerText);

  container.appendChild(heading);
  container.appendChild(text);
  container.appendChild(timer);
  container.appendChild(footer);

  document.head.appendChild(styleSheet);
  document.body.innerHTML = '';
  document.body.appendChild(container);
  document.body.setAttribute('data-clocklock-blocked', 'true');
  isBlocked = true;

  document.querySelectorAll('video').forEach((v) => v.pause());
  document.querySelectorAll('audio').forEach((a) => a.pause());
}

function formatTime(milliseconds: number) {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
