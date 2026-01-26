# Testing Guidelines

Moodify uses Karma + Jasmine for unit testing with 80% minimum coverage requirement.

## Commands

```bash
npm test           # Watch mode for development
npm run test:ci    # Single run with coverage (CI)
```

## Test Structure

Each component and service has a co-located `.spec.ts` file:

```
src/app/
├── app.spec.ts
├── components/
│   ├── header.component.spec.ts
│   ├── mood-input.component.spec.ts
│   └── ...
├── services/
│   └── openai.service.spec.ts
└── transloco-loader.spec.ts
```

## Writing Tests

### Component Tests
- Use `TestBed.configureTestingModule()` with standalone components
- Mock services using `jasmine.createSpyObj()`
- Test signal changes and component interactions
- Reference: [app.spec.ts](src/app/app.spec.ts)

### Service Tests
- Mock HTTP calls using `HttpClientTestingModule`
- Test error handling paths
- Reference: [openai.service.spec.ts](src/app/services/openai.service.spec.ts)

### i18n Tests
- Use `TranslocoTestingModule` with test translations
- Reference: [transloco-loader.spec.ts](src/app/transloco-loader.spec.ts)

## Coverage

Reports generated in `coverage/` directory. Open `coverage/index.html` for HTML report.

**Minimum thresholds (configured in karma.conf.js):**
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%
