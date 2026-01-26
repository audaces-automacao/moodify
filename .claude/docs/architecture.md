# Architecture Overview

Moodify is a single-page Angular 21 application demonstrating AI-powered fashion mood board generation.

## Application Flow

```
User Input → OpenAI Service → GPT-4o API → Mood Board Display
```

1. User enters style description in `MoodInputComponent`
2. `OpenAIService` sends prompt to GPT-4o API
3. Response parsed into `MoodBoard` model
4. `MoodBoardComponent` displays results via child components

## Project Structure

```
src/app/
├── components/           # Presentational components
│   ├── header.component.ts
│   ├── language-switcher.component.ts
│   ├── mood-input.component.ts        # Input + example chips
│   ├── mood-board.component.ts        # Results container
│   ├── color-palette.component.ts     # Color swatches
│   ├── fabric-list.component.ts       # Fabric cards
│   ├── style-tags.component.ts        # Style keywords
│   ├── outfit-grid.component.ts       # Outfit suggestions
│   └── loading-skeleton.component.ts
├── services/
│   └── openai.service.ts              # OpenAI API integration
├── models/
│   └── mood-board.model.ts            # TypeScript interfaces
├── app.ts                             # Root component (container)
├── app.config.ts                      # Providers, routing, i18n
└── transloco-loader.ts                # Translation file loader
```

## Key Patterns

### Standalone Components
All components are standalone (no NgModules). Imports declared per-component.

### Signals
State management uses Angular signals for reactivity without zone.js.

### Container/Presentational
- `App` and `MoodBoard` are container components (manage state)
- Other components are presentational (receive inputs, emit outputs)

## Configuration

- **Environment**: `src/environments/environment.ts` (API keys, endpoints)
- **i18n**: `public/i18n/{en,pt}.json` (translations)
- **Build**: `angular.json` (build configuration)
