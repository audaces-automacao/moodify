# Testing Guidelines

Moodify frontend uses Karma + Jasmine for unit testing with 80% minimum coverage.

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
- `src/app/auth/*.spec.ts`

## Writing Tests

### Test File Location
Place `.spec.ts` files next to the file being tested.

### Test Organization
Use `describe` blocks for the component/service name. Use `it` blocks with clear behavior descriptions.

### Component Test Setup
Standalone components are imported directly in `TestBed` (see `mood-input.component.spec.ts:26-33`):
```
TestBed.configureTestingModule({
  imports: [MyComponent, TranslocoTestingModule.forRoot(...)],
})
```

### Service Test Setup
Use `provideHttpClient()` + `provideHttpClientTesting()` for HTTP services (see `openai.service.spec.ts:41-48`):
```
TestBed.configureTestingModule({
  providers: [MyService, provideHttpClient(), provideHttpClientTesting()],
})
```

### i18n in Tests
Use `TranslocoTestingModule.forRoot()` with inline translations for component tests that use `TranslocoPipe` (see `mood-input.component.spec.ts:28-31`).

### Mocking
- HTTP calls: Angular's `HttpTestingController` with `httpMock.verify()` in `afterEach`
- Services: `jasmine.createSpyObj('ServiceName', ['method1', 'method2'])`
- For OpenAI service tests, mock the full API response shape (see `openai.service.spec.ts:12-33`)

### Signal Testing
Access signal values via `component.signalName()` call syntax (see `mood-input.component.spec.ts:45-47`).

### Coverage
- Coverage reports in `coverage/` directory
- View HTML report: `coverage/index.html`
- Minimum threshold: 80% statements, branches, functions, lines
