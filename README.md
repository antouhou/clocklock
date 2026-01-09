# TubeLock

A browser extension built with Svelte 5 and TypeScript.

## Development

```bash
# Install dependencies
npm install

# Build the extension
npm run build

# Build in watch mode (for development)
npm run dev
```

## Loading the Extension

### Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist` folder from this project

### Firefox

1. Open Firefox and go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on..."
3. Select the `dist/manifest.json` file

## Project Structure

```
src/
├── assets/          # Extension icons
├── popup/           # Popup UI (Svelte app)
│   ├── index.html   # Popup entry point
│   ├── main.ts      # Svelte mount point
│   └── App.svelte   # Main popup component
└── manifest.json    # Extension manifest
```
