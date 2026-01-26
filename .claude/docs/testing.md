# Testing Guidelines

Testing patterns and conventions for Moodify.

## Test Framework

- **Runner**: Karma
- **Framework**: Jasmine
- **Coverage**: karma-coverage

## Commands

```bash
npm test             # Interactive test runner with Chrome
npm run test:ci      # Headless tests with coverage
```

## Test File Conventions

- Test files: `*.spec.ts` alongside source files
- Use Angular TestBed for component tests
- Mock services with Jasmine spies

## Test Structure

```typescript
describe('ComponentName', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentName],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ComponentName);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
```

## Best Practices

- Test behavior, not implementation details
- Use meaningful test descriptions
- Keep tests focused and independent
- Mock external dependencies
- Avoid testing Angular internals
