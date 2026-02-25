# Server Architecture

Express.js backend proxy that handles JWT authentication and relays requests to OpenAI APIs.

## File Structure

- `index.js` — Routes, configuration, and startup
- `middleware.js` — Reusable middleware factories and helpers

## Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/login` | POST | No | Validate credentials, return JWT |
| `/api/auth/verify` | GET | Yes | Validate token, return user info |
| `/api/chat/completions` | POST | Yes | Proxy to OpenAI Chat API |
| `/api/images/generations` | POST | Yes | Proxy to OpenAI Images API |

## Middleware Stack

Applied in order via `applyMiddleware()` (`middleware.js:71-76`):
1. `helmet` — Security headers with Content Security Policy (`middleware.js:8-20`)
2. `cors` — Cross-origin handling, configurable via `ALLOWED_ORIGINS` (`middleware.js:64-69`)
3. `compression` — Response compression (`middleware.js:74`)
4. `express.json` — Body parsing with 1MB limit (`middleware.js:75`)
5. `authLimiter` — Rate limiting on auth endpoints: 5 attempts/15 min (`middleware.js:54-62`)
6. `authMiddleware` — JWT validation, attaches `req.user` (`middleware.js:22-40`)

## Request Validation

- `validateChatRequest` — Validates `messages` array with `role` and `content` strings (`middleware.js:42-45`)
- `validateImageRequest` — Validates `prompt` string with optional `n` and `size` (`middleware.js:47-52`)

## Static File Serving

In production, serves Angular build from `dist/moodify/browser/` with SPA fallback (`index.js:102-108`).

## Environment Variables

- `OPENAI_API_KEY` — Required. Server exits on startup if missing.
- `JWT_SECRET` — Required. Server exits on startup if missing.
- `PORT` — Optional, defaults to 3000.
- `ALLOWED_ORIGINS` — Optional comma-separated CORS origins.
