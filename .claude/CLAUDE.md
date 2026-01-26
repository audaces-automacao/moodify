<!-- Keep this file and .claude/docs/ updated when project structure, conventions, or tooling changes -->

# Moodify

AI-powered fashion mood board generator demo using Angular 21 with standalone components, signals, Tailwind CSS v4, and OpenAI GPT-4o integration.

## Tech Stack

- **Framework**: Angular 21 (standalone components, signals, zoneless)
- **Styling**: Tailwind CSS v4 with PostCSS
- **AI**: OpenAI GPT-4o via REST API
- **i18n**: @jsverse/transloco (English, Portuguese)
- **Testing**: Karma + Jasmine (80% coverage minimum)
- **Linting**: ESLint + Prettier

## Commands

```bash
npm start          # Dev server at localhost:4200
npm run build      # Production build to dist/
npm test           # Run tests in watch mode
npm run test:ci    # CI tests with coverage
npm run lint       # ESLint + Prettier check
```

## Project Structure

```
src/app/
├── components/    # UI components (header, mood-input, mood-board, etc.)
├── services/      # Business logic (openai.service.ts)
├── models/        # TypeScript interfaces (mood-board.model.ts)
├── app.ts         # Root component
└── app.config.ts  # App configuration with providers
```

## Documentation

Read the relevant doc before making changes:

- [coding-guidelines.md](.claude/docs/coding-guidelines.md) - For new features, refactoring, code structure
- [testing.md](.claude/docs/testing.md) - For writing or modifying tests
- [styling.md](.claude/docs/styling.md) - For UI components, CSS, visual changes
- [architecture.md](.claude/docs/architecture.md) - For understanding project structure, data flow

## Key Conventions

- Use standalone components with signals (not modules or zone.js)
- All components have co-located `.spec.ts` test files
- Translations in `public/i18n/{en,pt}.json`
- Environment config in `src/environments/`
