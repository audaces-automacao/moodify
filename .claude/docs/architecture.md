# Architecture

## Overview

Full-stack Angular application with a separate Express.js backend. The Angular frontend proxies API requests to the Express server during development; in production, Express serves the built Angular assets and handles API routes.

## Directory Map

| Directory | Purpose |
|-----------|---------|
| `src/app/auth/` | Authentication — service, interceptor, guard, login component |
| `src/app/components/` | UI components — mood board sections, header, theme/language switchers |
| `src/app/services/` | Business logic — OpenAI integration, theme management |
| `src/app/models/` | TypeScript interfaces for mood board data |
| `src/assets/i18n/` | Translation files (en.json, pt-BR.json) |
| `server/` | Express backend — JWT auth, OpenAI proxy, middleware |
| `public/` | Static assets served by Angular |

## Data Flow

- User submits style description via `MoodInputComponent`
- `HomeComponent` calls `OpenAIService.generateMoodBoard()`
- `OpenAIService` sends POST to `/api/generate` (proxied to Express in dev)
- `AuthInterceptor` attaches JWT token to request headers
- Express validates JWT, calls OpenAI GPT-4o, returns structured mood board JSON
- Components render: color palette, fabrics, style tags, outfit grid, AI-generated image

## Key Patterns

- **Standalone components with signals** — no NgModules, Angular 21 reactivity model
- **JWT auth flow** — login → token stored in localStorage → interceptor adds Authorization header → guard protects routes
- **Proxy pattern** — `proxy.conf.json` routes `/api/*` to Express during `ng serve`
- **i18n with Transloco** — lazy-loaded translations, browser language auto-detection

## Dependencies Between Modules

- `auth/` is independent — used by interceptor (HTTP layer) and guard (routing layer)
- `components/` depend on `services/` and `models/` but not on each other
- `server/` is fully independent — no shared code with frontend (separate package.json)
