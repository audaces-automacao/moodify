# Architecture

## Overview

Two-tier web application: Angular SPA frontend with Express.js backend API. The frontend handles UI rendering, routing, and i18n; the backend handles JWT authentication, OpenAI API proxying, and static file serving in production.

## Directory Map

| Directory | Purpose |
|-----------|---------|
| `src/app/auth/` | Auth service, HTTP interceptor, route guard, login component |
| `src/app/components/` | Presentational components (mood board, color palette, fabric list, etc.) |
| `src/app/services/` | Business logic services (OpenAI integration, theme management) |
| `src/app/models/` | TypeScript interfaces (mood board data model) |
| `server/` | Express backend (index.js entry, middleware.js for auth/rate-limiting) |
| `src/assets/i18n/` | Translation files (en.json, pt-BR.json) |

## Data Flow

- User submits style description via `MoodInputComponent`
- `OpenAIService` sends POST to `/api/chat/completions` with JWT token (injected by `authInterceptor`)
- Express backend validates JWT, forwards request to OpenAI GPT-4o API
- Response parsed into `MoodBoard` model, rendered by `MoodBoardComponent` and child components
- Optional: DALL-E image generation for outfit visualization via `/api/images/generations`

## Key Patterns

- Angular standalone components with signals (no NgModules)
- Lazy-loaded routes (`app.routes.ts` with `loadComponent`)
- HTTP interceptor chain: JWT injection + 401 redirect
- Express middleware chain: Helmet, CORS, compression, JSON parsing (global); JWT validation, rate limiting, request validation (per-route); error handling
- i18n via Transloco with lazy-loaded translation files

## Dependencies Between Modules

- `auth/` is independent — used by route guards, HTTP interceptor, and `HeaderComponent` (logout)
- `components/` depend on `services/` and `models/`; parent components compose children (e.g., `MoodBoardComponent` imports `ColorPaletteComponent`, `FabricListComponent`, etc.)
- `services/openai.service.ts` relies on `authInterceptor` (registered globally) for JWT headers — no direct import of `auth/`
- `server/` is fully independent — communicates with frontend only via HTTP API
