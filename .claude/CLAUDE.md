<!-- Keep this file, .claude/docs/, and subproject CLAUDE.md files updated when project structure changes -->

# Moodify

AI-Powered Fashion Mood Board Generator. Multi-project repository with 2 components.

## Architecture

| Subproject | Purpose | Stack |
|------------|---------|-------|
| `.` (root) | Angular frontend app | Angular 21, Tailwind CSS v4, TS, Vitest |
| `server/` | Express backend proxy | Express.js, JWT, Jest+Supertest |

## Commands

```bash
npm run dev        # Full stack: Express backend + Angular dev server
npm run build      # Production build to dist/
npm run lint       # ESLint + Prettier
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key |
| `JWT_SECRET` | Yes | Secret for JWT signing |

## Demo Credentials

- Email: `bob@audaces.com`
- Password: `12345`

## Subproject Docs

Each subproject has its own CLAUDE.md with subproject-specific guidance:
- `server/CLAUDE.md` - Express backend proxy with JWT auth and OpenAI API relay

## Documentation

Read the relevant doc before making changes:
- `.claude/docs/coding-guidelines.md` - For new features, refactoring, code structure
- `.claude/docs/testing.md` - For frontend (Angular) tests
- `.claude/docs/styling.md` - For UI components, CSS, visual changes
- `.claude/docs/architecture.md` - For frontend architecture and data flow
