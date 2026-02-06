<!-- Keep this file and .claude/docs/ updated when project structure, conventions, or tooling changes -->

# Moodify

AI-Powered Fashion Mood Board Generator built with Angular 21, Tailwind CSS v4, and OpenAI GPT-4o.

## Tech Stack

- **Frontend**: Angular 21 (standalone components, signals, functional guards/interceptors), Tailwind CSS v4
- **Backend**: Express.js proxy with JWT auth middleware (`server/index.js`)
- **AI**: OpenAI GPT-4o + DALL-E via `src/app/services/openai.service.ts`
- **i18n**: @jsverse/transloco (EN, PT-BR)
- **Testing**: Karma + Jasmine (80% coverage minimum)
- **Linting**: ESLint + angular-eslint + Prettier

## Commands

```bash
npm run dev        # Full stack: Express backend + Angular dev server
npm start          # Angular dev server only (requires backend running separately)
npm run build      # Production build to dist/
npm test           # Run tests in watch mode
npm run test:ci    # CI mode: single run with coverage
npm run lint       # ESLint + Prettier
```

## Key Modules

- **Auth** (`src/app/auth/`): JWT authentication with login page, route guard, HTTP interceptor
- **Components** (`src/app/components/`): Standalone UI components
- **Services** (`src/app/services/`): OpenAI API integration
- **Backend** (`server/`): Express proxy with auth middleware, protected API routes

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key |
| `JWT_SECRET` | Yes | Secret for JWT signing |

## Demo Credentials

- Email: `bob@audaces.com`
- Password: `12345`

## Documentation

Read the relevant doc before making changes:

- [`coding-guidelines.md`](.claude/docs/coding-guidelines.md) - For new features, refactoring, code structure
- [`testing.md`](.claude/docs/testing.md) - For writing or modifying tests
- [`styling.md`](.claude/docs/styling.md) - For UI components, CSS, visual changes
- [`architecture.md`](.claude/docs/architecture.md) - For understanding project structure, data flow
