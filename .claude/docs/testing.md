# Testing Guidelines

Moodify uses Karma + Jasmine for unit testing with 80% minimum coverage.

## Commands

```bash
npm test           # Watch mode - auto-reruns on changes
npm run test:ci    # Single run with coverage (CI)
```

## Test Structure

Each component/service has a `.spec.ts` file alongside it:
- `src/app/app.spec.ts`
- `src/app/components/*.spec.ts`
- `src/app/services/*.spec.ts`

## Writing Tests

### Test File Location
Place `.spec.ts` files next to the file being tested.

### Test Organization
Use `describe` blocks for the component/service name. Use `it` blocks with clear behavior descriptions.

### Mocking
- Mock HTTP calls using Angular's `HttpTestingController`
- Mock services using Jasmine spies or test doubles
- For OpenAI service tests, mock API responses

### Coverage
- Coverage reports in `coverage/` directory
- View HTML report: `coverage/index.html`
- Minimum threshold: 80% statements, branches, functions, lines

## Component Testing

Use Angular's `TestBed` to configure test modules:
- Import `provideHttpClient` and `provideHttpClientTesting` for HTTP tests
- Use `ComponentFixture` for component interaction tests
- Test signal-based components by updating inputs and checking outputs

## Service Testing

- Test public API methods
- Verify HTTP requests are made with correct parameters
- Test error handling paths
