# Architecture

## Overview

Client-server application: Angular 21 SPA frontend with Express.js backend API. In development, Angular proxies `/api/*` to Express. In production (Docker), Express serves both API routes and static Angular build artifacts.

## Directory Map

| Directory | Purpose |
|-----------|---------|
| `src/app/auth/` | Authentication — AuthService, JWT interceptor, route guard, login component |
| `src/app/components/` | UI components — mood board, color palette, fabrics, outfits, theme/language switchers |
| `src/app/services/` | Shared services — OpenAI API integration, theme management |
| `src/app/models/` | TypeScript interfaces for mood board data |
| `server/` | Express.js backend — API routes, middleware, JWT auth, OpenAI proxy |
| `public/i18n/` | Translation files (en.json, pt-BR.json) |

## Data Flow

- User enters style prompt → `MoodInputComponent` emits to `HomeComponent`
- `HomeComponent` calls `OpenaiService.generateMoodBoard()` → HTTP POST to `/api/mood-board`
- Express backend validates JWT, forwards prompt to OpenAI GPT-4o, returns structured mood board
- `MoodBoardComponent` renders results: color palette, fabrics, style tags, outfit grid
- Optional: `OutfitImageComponent` requests DALL-E image generation via `/api/outfit-image`

## Key Patterns

- Standalone Angular components with signals for reactive state
- JWT authentication: `AuthInterceptor` injects token, `AuthGuard` protects routes
- Express middleware chain: auth validation → rate limiting → error handling
- Proxy configuration (`proxy.conf.json`) bridges Angular dev server to Express backend

## Dependencies Between Modules

- `auth/` is self-contained — provides guard, interceptor, and service consumed by `app.config.ts`
- `components/` depend on `services/` and `models/` but not on each other (flat hierarchy)
- `server/` is an independent Node.js package with its own dependencies, connected only via HTTP API
