# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Start dev server at http://localhost:4200
npm run build      # Production build (outputs to dist/)
npm run lint       # Run ESLint + Prettier on src/**/*.ts and src/**/*.html
npm test           # Run tests in watch mode
npm run test:ci    # CI mode: single run with coverage
```

## Testing

```bash
npm test              # Run tests in watch mode
npm run test:ci       # CI mode: single run with coverage
```

**Run tests after any code changes to verify nothing is broken.**

Coverage reports are generated in `coverage/` directory. Open `coverage/index.html` for the HTML report.

### Test Patterns

Tests use Jasmine with Angular TestBed. Key patterns:

**Testing `input.required()`:**
```typescript
const fixture = TestBed.createComponent(MyComponent);
fixture.componentRef.setInput('myInput', value);
fixture.detectChanges();
```

**Testing `output()`:**
```typescript
const spy = jasmine.createSpy('outputSpy');
component.myOutput.subscribe(spy);
// trigger action
expect(spy).toHaveBeenCalledWith(expectedValue);
```

**Mocking TranslocoService:**
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

## Architecture

**Moodify** is an AI-powered fashion mood board generator built with Angular 21 and OpenAI.

### Tech Stack
- Angular 21 with standalone components and signals
- Tailwind CSS v4 (utility classes) + SCSS (component styles)
- OpenAI GPT-4o for mood board generation
- Karma + Jasmine for testing

### Component Patterns

All components are standalone (no NgModules). Key patterns:

- **State**: Use Angular signals (`signal()`, `computed()`)
- **Inputs**: Use `input()` and `input.required()` (not `@Input()` decorator)
- **Outputs**: Use `output()` (not `@Output()` decorator)
- **DI**: Use `inject()` function (not constructor injection)
- **Templates**: Inline templates preferred for smaller components
- **Selectors**: Prefix with `app-` (e.g., `app-mood-board`)

Example:
```typescript
@Component({
  selector: 'app-example',
  imports: [OtherComponent],
  template: `...`,
})
export class ExampleComponent {
  private service = inject(SomeService);
  data = input.required<DataType>();
  clicked = output<void>();
  localState = signal<string>('');
}
```

### Data Flow

1. `App` component holds main state (`moodBoard`, `isLoading`, `error` signals)
2. `MoodInputComponent` emits user prompts via `generate` output
3. `OpenAIService` calls GPT-4o API and returns typed `MoodBoardResponse`
4. `MoodBoardComponent` displays results via child components (color palette, fabrics, tags, outfits)

### API Configuration

OpenAI settings are in `src/environments/environment.ts`. The API key is client-side exposed (demo only).

### Styling

- Editorial/fashion magazine aesthetic (Vogue-inspired)
- Custom color tokens: `editorial-black`, `editorial-white`, `editorial-charcoal`, `editorial-gold`, `editorial-cream`
- Fonts: Playfair Display (serif headings), Inter (sans-serif body)
