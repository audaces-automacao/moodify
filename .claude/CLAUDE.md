<!-- Keep this file and .claude/docs/ updated when project structure, conventions, or tooling changes -->

# Moodify

AI-Powered Fashion Mood Board Generator built with Angular 21, Tailwind CSS v4, and OpenAI GPT-4o.

## Tech Stack

- **Framework**: Angular 21 (standalone components, signals)
- **Styling**: Tailwind CSS v4 with PostCSS
- **AI**: OpenAI GPT-4o API via `src/app/services/openai.service.ts`
- **i18n**: @jsverse/transloco (English, Portuguese)
- **Testing**: Karma + Jasmine (80% coverage minimum)
- **Linting**: ESLint + angular-eslint + Prettier

## Commands

```bash
npm start          # Dev server at http://localhost:4200
npm run build      # Production build to dist/
npm test           # Run tests in watch mode
npm run test:ci    # CI mode: single run with coverage
npm run lint       # ESLint + Prettier
```

## Documentation

Read the relevant doc before making changes:

- [coding-guidelines.md](.claude/docs/coding-guidelines.md) - For new features, refactoring, code structure
- [testing.md](.claude/docs/testing.md) - For writing or modifying tests
- [styling.md](.claude/docs/styling.md) - For UI components, CSS, visual changes
- [architecture.md](.claude/docs/architecture.md) - For understanding project structure, data flow
