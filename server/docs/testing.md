# Testing

## Test Runner

Jest via `node --experimental-vm-modules node_modules/jest/bin/jest.js` (ESM support).

## Running Tests

```bash
cd server
npm test                 # Run all backend tests
```

## Test Structure

- `server/*.spec.js` — co-located with source files (`index.spec.js`, `middleware.spec.js`)

## Writing Tests

- Use `supertest` for HTTP endpoint testing
- Mock external dependencies (OpenAI API, JWT verification) with `jest.mock()`
- Test file naming: `<name>.spec.js` alongside the source file
- ESM requires `--experimental-vm-modules` flag for Jest

## Workflow

- Write or update tests alongside the code they verify, not as a separate step after.
- Bug fixes: add a failing test that reproduces the bug before writing the fix.
- After implementation, run the full test suite to verify nothing else broke.

## Coverage

Jest built-in coverage via `jest.config.js`. Reports to `server/coverage/`.
