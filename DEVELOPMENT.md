## Development

```bash
# Install dependencies
npm install
# Compile the extension
npm run build
# Deleted old build and compile new one
npm run rebuild
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