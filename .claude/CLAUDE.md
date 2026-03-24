<!-- Keep this file and .claude/docs/ updated when project structure, conventions, or tooling changes -->

# Moodify

AI-powered fashion mood board generator. Built with Angular 21, Express.js, Tailwind CSS v4, OpenAI GPT-4o.

## Conventions

- Standalone Angular components (no NgModules), signals-based reactivity
- Bold editorial design (Vogue/Harper's Bazaar aesthetic): Playfair Display + Inter fonts
- SCSS for component styles, Tailwind CSS v4 for utility classes
- i18n via @jsverse/transloco (en, pt-BR) — all user-facing strings must be translatable
- Express backend in `server/` — JWT auth, OpenAI proxy, rate limiting

## Commands

```bash
npm run dev              # Start Angular + Express dev servers
npm run build            # Build the project
npm test                 # Run frontend tests (Vitest)
npm run test:ci          # Frontend tests with coverage
npm run lint             # Lint source files
cd server && npm test    # Run backend tests (Jest)
```

## Project Structure

- `src/app/` — Angular frontend (components, services, auth, models)
- `server/` — Express.js backend API (has own package.json, CLAUDE.md)
- `public/` — Static assets (i18n translation files)

## Before Writing Code

ALWAYS read `.claude/docs/coding-guidelines.md` before planning or implementing any changes. All code must follow these principles.

## Documentation

- `.claude/docs/testing.md` — Test framework, conventions, coverage
- `.claude/docs/styling.md` — UI styling patterns and design tokens
- `.claude/docs/architecture.md` — System architecture and data flow

## Agents

After implementing features or fixing bugs:
- `.claude/agents/code-simplifier.md` — simplifies recently changed code
- `.claude/agents/test-guardian.md` — flags missing test coverage
