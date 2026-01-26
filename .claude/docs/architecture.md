# Architecture Guide

This document describes the component architecture and patterns used in Moodify.

## Tech Stack

- **Angular 21** with standalone components and signals
- **Tailwind CSS v4** (utility classes) + SCSS (component styles)
- **OpenAI GPT-4o** for mood board generation
- **Karma + Jasmine** for testing

## Component Patterns

All components are standalone (no NgModules). Key patterns:

| Pattern | Convention |
|---------|------------|
| **State** | Use Angular signals (`signal()`, `computed()`) |
| **Inputs** | Use `input()` and `input.required()` (not `@Input()` decorator) |
| **Outputs** | Use `output()` (not `@Output()` decorator) |
| **DI** | Use `inject()` function (not constructor injection) |
| **Templates** | Inline templates preferred for smaller components |
| **Selectors** | Prefix with `app-` (e.g., `app-mood-board`) |

### Example Component

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

**Reference**: See `src/app/components/mood-input.component.ts` for a real example.

## Data Flow

1. `App` component holds main state (`moodBoard`, `isLoading`, `error` signals)
2. `MoodInputComponent` emits user prompts via `generate` output
3. `OpenAIService` calls GPT-4o API and returns typed `MoodBoardResponse`
4. `MoodBoardComponent` displays results via child components:
   - Color palette
   - Fabrics list
   - Style tags
   - Outfit grid

## API Configuration

OpenAI settings are in `src/environments/environment.ts`. The API key is client-side exposed (demo only).

## Project Structure

```
src/app/
├── components/          # UI components
│   ├── mood-input/      # User prompt input
│   ├── mood-board/      # Main display component
│   ├── color-palette/   # Color swatches
│   ├── fabric-list/     # Fabric recommendations
│   ├── style-tags/      # Style descriptors
│   └── outfit-grid/     # Outfit suggestions
├── services/            # Business logic
│   └── openai.service   # OpenAI API integration
└── models/              # TypeScript interfaces
```
