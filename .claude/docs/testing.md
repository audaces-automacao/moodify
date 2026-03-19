# Testing

## Test Runner

Vitest (via Angular CLI `@angular/build:unit-test`) for frontend tests.

## Running Tests

```bash
npm test                 # Run all frontend tests (watch mode)
npm run test:ci          # Single run with coverage
```

## Test Structure

- `src/app/**/*.spec.ts` — co-located with source files, mirrors component/service structure

## Writing Tests

- Each component, service, guard, and interceptor has a corresponding `.spec.ts` file
- Use `vi.spyOn()` for mocking services and dependencies
- Angular testing uses `TestBed` for component/service setup
- Test file naming: `<name>.spec.ts` alongside the source file
- Edge cases and error paths get their own `describe` blocks

## Workflow

- Write or update tests alongside the code they verify, not as a separate step after.
- Bug fixes: add a failing test that reproduces the bug before writing the fix.
- After implementation, run the full test suite to verify nothing else broke.

## Coverage

`@vitest/coverage-v8` via `npm run test:ci`. Reports to `coverage/`.
Minimum thresholds: **80%** (statements, branches, functions, lines).
