# ClockLock

ClockLock is a browser extension that lets you set up cooldown periods after you've used a website for
too long. For example, you can set up a rule that after you've spent 20 minutes on YouTube, you can't
open it for an hour.

## Contributing

For contribution guidelines, please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) file.
How to install and load the extension, please refer to the [DEVELOPMENT.md](DEVELOPMENT.md) file.

## Building the extension from source

The build process requires Node.js 20.0.0 or later. The extension uses Svelte, TypeScript and Vite.

### Install dependencies

```bash
npm ci
```

### Build

Build command produces a `./dist` folder with the compiled extension and a `./clocklock.zip` file with the packaged extension.

```bash
npm run build
```
