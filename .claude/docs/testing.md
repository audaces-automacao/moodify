# Testing

## Test Runner

**Frontend:** Vitest via Angular's `@angular/build:unit-test` builder.
**Backend:** Jest with Supertest (in `server/`).

## Running Tests

```bash
npm test                 # Frontend tests (Vitest, watch mode)
npm run test:ci          # Frontend: single run with coverage
cd server && npm test    # Backend tests (Jest)
test.cmd                 # All tests (backend + frontend)
test-coverage.cmd        # All tests with coverage reports
```

**Windows note:** Vitest must be run from PowerShell or cmd.exe, not Git Bash (MSYS2 incompatibility).

## Test Structure

- Frontend specs co-located with source: `src/app/**/*.spec.ts`
- Backend specs co-located with source: `server/**/*.spec.js`
- Each component, service, guard, and interceptor has a corresponding spec file

## Writing Tests

- Mock services with `vi.fn()` objects and `mockReturnValue()` for Vitest
- jsdom does not implement `scrollIntoView`, `matchMedia`, or `img.loading` — use `vi.stubGlobal()` for missing APIs
- Use `TestBed.configureTestingModule()` with standalone component imports
- Backend tests use Supertest for HTTP assertions against Express routes

## Workflow

- Write or update tests alongside the code they verify, not as a separate step after.
- Bug fixes: add a failing test that reproduces the bug before writing the fix.
- After implementation, run the full test suite to verify nothing else broke.

## Coverage

- Tool: `@vitest/coverage-v8` (frontend), Jest built-in (backend)
- Frontend report: `coverage/index.html`
- Backend report: `server/coverage/`
- **Minimum threshold: 80%** (statements, branches, functions, lines) — enforced in `angular.json`
