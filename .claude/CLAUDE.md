<!-- Keep this file, .claude/docs/, and subproject CLAUDE.md files updated when project structure changes -->

# Moodify

AI-powered fashion mood board generator. Monorepo with 2 packages.

## Architecture

| Subproject | Purpose | Stack |
|------------|---------|-------|
| `/` (root) | Frontend — mood board UI, auth, i18n | TS, Angular 21, Tailwind v4, Vitest |
| `server/` | Backend — JWT auth, OpenAI proxy, static serving | Node.js/Express (ESM), Jest |

## Commands

```bash
npm run dev              # Start both Angular (4200) + Express (3000) via concurrently
npm run build            # Build Angular frontend
npm run test:ci          # Frontend tests (Vitest, single run + coverage)
npm run lint             # ESLint (Angular + Prettier)
cd server && npm test    # Backend tests (Jest)
```

## Conventions

- Angular standalone components with signals (no NgModules)
- i18n via @jsverse/transloco (en, pt-BR) — translations in `src/assets/i18n/`
- Dev proxy: Angular at :4200 proxies `/api/*` to Express at :3000
- Production: Docker serves built Angular static files via Express
- Bug fixes require a failing test before the fix
- 80% minimum coverage (statements, branches, functions, lines)

## Subproject Docs

Each subproject has its own CLAUDE.md with subproject-specific guidance:
- `server/CLAUDE.md` - Express backend conventions and commands

## Before Writing Code

ALWAYS read `.claude/docs/coding-guidelines.md` before planning or implementing any changes. All code must follow these principles.

## Documentation

- `.claude/docs/testing.md` - Frontend testing with Vitest
- `.claude/docs/styling.md` - Tailwind CSS v4 and Angular component styling
- `.claude/docs/architecture.md` - Project structure and data flow
