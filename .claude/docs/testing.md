# Testing

## Test Runner

Vitest via Angular CLI (`ng test` wraps Vitest). Coverage via `@vitest/coverage-v8`.

## Running Tests

```bash
npm test               # Watch mode (Vitest)
npm run test:ci        # Single run with coverage
```

## Test Structure

- `src/app/**/*.spec.ts` — co-located with source files (components, services, guards, interceptors)
- Backend tests: see `server/docs/testing.md` (Jest + Supertest)

## Writing Tests

- Use `TestBed.configureTestingModule()` for Angular component/service tests
- Mock HTTP calls with Angular's `provideHttpClientTesting` and `HttpTestingController`
- Test file naming: `<name>.spec.ts` alongside the source file
- Use `vi.spyOn()` / `vi.fn()` for mocking (Vitest API)
- For components with dependencies, provide mocks or stubs in the test module
- jsdom does not implement `scrollIntoView`, `matchMedia`, or `img.loading` — use `vi.stubGlobal()` for missing browser APIs

## Workflow

- Write or update tests alongside the code they verify, not as a separate step after.
- Bug fixes: add a failing test that reproduces the bug before writing the fix.
- After implementation, run the full test suite to verify nothing else broke.

## Coverage

Vitest built-in coverage via `@vitest/coverage-v8`. Reports to `coverage/`.
Minimum: 80% (statements, branches, functions, lines).
