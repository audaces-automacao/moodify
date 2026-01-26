# Architecture Overview

Moodify is an Angular 21 standalone application that generates AI-powered fashion mood boards.

## Directory Structure

```
src/app/
├── components/          # UI components (standalone)
├── services/            # Business logic and API calls
├── models/              # TypeScript interfaces
├── app.ts               # Root component
├── app.config.ts        # Application configuration
└── transloco-loader.ts  # i18n translation loader
```

## Key Components

### Input Flow
- `mood-input.component.ts` - Text input + example prompt chips
- Emits user prompt to parent `app.ts`

### Display Components
- `mood-board.component.ts` - Results container, orchestrates child components
- `color-palette.component.ts` - Color swatches with hex codes
- `fabric-list.component.ts` - Fabric recommendation cards
- `style-tags.component.ts` - Style keyword tag cloud
- `outfit-grid.component.ts` - Outfit suggestion grid

### Services
- `openai.service.ts` - OpenAI API integration, prompt engineering, response parsing

### Models
- `mood-board.model.ts` - TypeScript interfaces for `MoodBoard`, `Color`, `Fabric`, `OutfitItem`

## Data Flow

1. User enters prompt in `MoodInputComponent`
2. `AppComponent` receives prompt, calls `OpenAIService.generateMoodBoard()`
3. Service sends request to OpenAI API, parses JSON response
4. `MoodBoardComponent` displays results via child components

## i18n Architecture

- `@jsverse/transloco` for translations
- Translation files: `public/i18n/{en,pt}.json`
- `transloco-loader.ts` handles async loading
- `language-switcher.component.ts` toggles locale

## Environment Configuration

- `src/environments/environment.ts` - OpenAI API key and model config
- **Note**: API key exposed in frontend (demo only, use backend proxy for production)
