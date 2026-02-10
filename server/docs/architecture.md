# Server Architecture

Express.js backend proxy that handles JWT authentication and relays requests to OpenAI APIs.

## Entry Point

Single file: `server/index.js` — all routes, middleware, and configuration.

## Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/login` | POST | No | Validate credentials, return JWT |
| `/api/auth/verify` | GET | Yes | Validate token, return user info |
| `/api/chat/completions` | POST | Yes | Proxy to OpenAI Chat API |
| `/api/images/generations` | POST | Yes | Proxy to OpenAI Images API |

## Middleware Stack

Applied in order:
1. `helmet` — Security headers with Content Security Policy (`index.js:88-102`)
2. `cors` — Cross-origin handling, configurable via `ALLOWED_ORIGINS` (`index.js:22-28`)
3. `compression` — Response compression (`index.js:104`)
4. `express.json` — Body parsing with 1MB limit (`index.js:105`)
5. `authLimiter` — Rate limiting on auth endpoints: 5 attempts/15 min (`index.js:31-37`)
6. `authMiddleware` — JWT validation, attaches `req.user` (`index.js:54-70`)

## Request Validation

- `validateChatRequest` — Validates `messages` array with `role` and `content` strings (`index.js:73-78`)
- `validateImageRequest` — Validates `prompt` string with optional `n` and `size` (`index.js:80-85`)

## Static File Serving

In production, serves Angular build from `dist/moodify/browser/` with SPA fallback (`index.js:176-182`).

## Environment Variables

- `OPENAI_API_KEY` — Required. Server exits on startup if missing.
- `JWT_SECRET` — Required. Server exits on startup if missing.
- `PORT` — Optional, defaults to 3000.
- `ALLOWED_ORIGINS` — Optional comma-separated CORS origins.
