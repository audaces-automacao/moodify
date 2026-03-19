<!-- Keep this file and docs/ updated when this subproject's conventions change -->

# Moodify Server

Part of the Moodify monorepo.

## What

Express.js backend API handling JWT authentication, OpenAI proxy, and static file serving. Built with Node.js/Express (ESM).

## Why

- Entry point: `index.js` — Express app with middleware chain
- Middleware in `middleware.js` — auth validation, rate limiting, error handling
- ESM modules (`"type": "module"` in package.json)
- Dependencies installed via root `postinstall` script

## How

cd server
npm test                 # Run Jest tests
npm start                # Start server on port 3000

## Documentation

Read the relevant doc before making changes:
- `docs/testing.md` - For writing or modifying tests

Root `.claude/docs/coding-guidelines.md` applies to all packages in this monorepo.
