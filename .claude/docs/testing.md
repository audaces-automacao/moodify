# Testing Guide

This document provides detailed testing patterns for the Moodify codebase.

## Commands

```bash
npm test           # Run tests in watch mode
npm run test:ci    # CI mode: single run with coverage
```

**Run tests after any code changes to verify nothing is broken.**

Coverage reports are generated in `coverage/` directory. Open `coverage/index.html` for the HTML report.

## Test Patterns

Tests use Jasmine with Angular TestBed. All components are standalone.

### Testing `input.required()`

Use `fixture.componentRef.setInput()` to set required inputs before triggering change detection.

**Reference**: See `src/app/components/color-palette.component.spec.ts:33` for a working example.

```typescript
const fixture = TestBed.createComponent(MyComponent);
fixture.componentRef.setInput('myInput', value);
fixture.detectChanges();
```

### Testing `output()`

Subscribe to outputs with a Jasmine spy, then trigger the action and verify.

**Reference**: See `src/app/components/mood-input.component.spec.ts:101` for a working example.

```typescript
const spy = jasmine.createSpy('outputSpy');
component.myOutput.subscribe(spy);
// trigger action
expect(spy).toHaveBeenCalledWith(expectedValue);
```

### Mocking TranslocoService

Use `TranslocoTestingModule` to provide mock translations in tests.

**Reference**: See `src/app/components/mood-input.component.spec.ts:28` for a working example.

```typescript
import { TranslocoTestingModule } from '@jsverse/transloco';

TestBed.configureTestingModule({
  imports: [
    TranslocoTestingModule.forRoot({
      langs: { en: { key: 'value' } },
      translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
    }),
  ],
});
```

## Test File Locations

| Pattern | Example Files |
|---------|---------------|
| `setInput()` for required inputs | `color-palette.component.spec.ts`, `fabric-list.component.spec.ts`, `outfit-grid.component.spec.ts` |
| Output testing with spies | `mood-input.component.spec.ts`, `openai.service.spec.ts` |
| Transloco mocking | All component spec files that render translated text |
