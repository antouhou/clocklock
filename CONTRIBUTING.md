## About the project

ClockLock is an browser extension that let you set up cooldown periods afetr you've used a website for
too long. For example, you can set up a rule that after you've spent 20 minutes on YouTube, you can't
open it for an hour.

The project uses Svelte 5 and TypeScript. Main entrypoint is `src/popup/App.svelte`.
If you want to contribute to this project, please follow a set of simple rules:

## Coding Style

1. Use CSS variables:
   - Use CSS variables for colors and sizes.
   - Don't hardcode spacings and sizes into classes: use multiples of CSS variables.
2. Keep styling consistent and cohesive: rounded border should be rounded the same way, spacings
   between components of the same rank should be the same, etc.
3. Always check that your code at least compiles: run `npm run rebuild`.
4. Try to write most logic in such a way that makes it easily testable
   - Write tests to make sure that everything works
   - Run tests to make sure that nothing breaks
5. Important: run lint and tests after you made changes to the codebase.
   - run `npm run lint` to check for linting errors, run `npm run lint:fix` to autofix linting errors where possible, fix the rest manually
   - run `npm run format` to format the codebase
   - run `npm run test` to run tests
   - run `npm run rebuild` to check that everything compiles
