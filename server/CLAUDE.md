<!-- Keep this file and docs/ updated when this subproject's conventions change -->

# Moodify Server

Part of the Moodify monorepo.

## What

Express.js backend proxy with JWT authentication and OpenAI API relay. Built with Express, jsonwebtoken, helmet, cors, compression.

## Why

- Single entry point: `index.js` — all routes, middleware, and config in one file
- JWT auth middleware validates tokens on protected routes
- Proxies to OpenAI Chat and Images APIs (keeps API key server-side)
- Serves Angular production build as static files with SPA fallback
- Security middleware: helmet (CSP), cors, rate limiting, compression

## How

```bash
cd server
npm start          # Start server (requires .env at project root)
npm test           # Run Jest tests (--experimental-vm-modules)
# Or from project root: test.cmd runs both backend + frontend tests
```

## Documentation

Read the relevant doc before making changes:
- `docs/testing.md` - For writing or modifying server tests
- `docs/architecture.md` - For understanding endpoints, middleware, and data flow

Root `.claude/docs/coding-guidelines.md` applies to all packages in this monorepo.
