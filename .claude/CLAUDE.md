# Moodify

Angular 21 application with Tailwind CSS v4 and Transloco for internationalization.

## Tech Stack

- **Framework**: Angular 21.1 (standalone components)
- **Styling**: Tailwind CSS v4 with PostCSS
- **i18n**: @jsverse/transloco
- **Testing**: Karma + Jasmine
- **Linting**: ESLint + Prettier

## Commands

```bash
npm run build        # Production build
npm run test:ci      # Run tests (headless, with coverage)
npm run lint         # Lint and format check
```

## Development

```bash
npm start            # Dev server at localhost:4200
npm test             # Interactive test runner
```

## Guidelines

Before making changes, review the relevant documentation:

- [coding-guidelines.md](.claude/docs/coding-guidelines.md) - Architecture and design principles
- [testing.md](.claude/docs/testing.md) - Test patterns and conventions
- [styling.md](.claude/docs/styling.md) - Tailwind CSS usage and design tokens
- [architecture.md](.claude/docs/architecture.md) - Project structure and data flow

## Key Conventions

- Use standalone components (no NgModules)
- Follow Angular signals for state management
- Use Transloco `translate` pipe for all user-facing text
- Prefer Tailwind utility classes over custom CSS
