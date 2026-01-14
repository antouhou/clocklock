# ClockLock

ClockLock is a simple way to break free from endless scrolling.

ClockLock helps you build healthier browsing habits by setting automatic cooldown periods for websites that steal your time and attention. Do you feel like you've watch YouTube way too much, but don't want to give it up altogether? Set the rule to watch 20 minutes with a 1 hour cooldown period.

How it works:

1. Enter a website domain (like youtube.com)
2. Set your time budget (e.g., 20 minutes)
3. Set your cooldown period (e.g., 1 hour)
4. Done! No complicated set up required - 30 seconds and you good to go.

Why ClockLock?
ClockLock is dead simple, yet powerful. It does what you need it to do without turning the setup into a distracting process of its own.

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
