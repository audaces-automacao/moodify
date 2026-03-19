<!-- Keep this file, .claude/docs/, and subproject CLAUDE.md files updated when project structure changes -->

# Moodify

AI-powered fashion mood board generator. Monorepo with 2 packages.

## Architecture

| Subproject | Purpose | Stack |
|---------|---------|-------|
| `/` (root) | Angular frontend — mood board UI with i18n and theming | TS/Angular 21, Tailwind v4 |
| `server/` | Express backend — auth, OpenAI proxy, static serving | Node.js/Express |

## Commands

npm run dev              # Start both servers (Angular + Express)
npm run build            # Build Angular frontend
npm run lint             # Lint all TypeScript + HTML
npm run test:ci          # Frontend tests with coverage
cd server && npm test    # Backend tests (Jest)

## Conventions

- Standalone components with signals (no NgModules)
- JWT auth with interceptor; proxy config routes /api/* to Express
- i18n via @jsverse/transloco (en, pt-BR) — translations in src/assets/i18n/
- Components use `app-` prefix (kebab-case selectors, camelCase directives)
- Strict TypeScript with strict Angular templates

## Subproject Docs

- `server/CLAUDE.md` - Express backend API

## Before Writing Code

ALWAYS read `.claude/docs/coding-guidelines.md` before planning or implementing any changes. All code must follow these principles.

## Documentation

- `.claude/docs/testing.md` - Frontend testing with Vitest
- `.claude/docs/styling.md` - Tailwind CSS v4 and editorial design patterns
- `.claude/docs/architecture.md` - Architecture map and data flow

## Agents

After implementing features or fixing bugs:
- `.claude/agents/code-simplifier.md` — simplifies recently changed code
- `.claude/agents/test-guardian.md` — flags missing test coverage
