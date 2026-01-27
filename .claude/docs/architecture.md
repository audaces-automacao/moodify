# Architecture Overview

Moodify is an Angular 21 standalone application that generates AI-powered fashion mood boards with JWT authentication.

## Directory Structure

```
src/app/
├── auth/                # Authentication module
│   ├── auth.service.ts      # Token management, login/logout/verify
│   ├── auth.interceptor.ts  # JWT header injection, 401 handling
│   ├── auth.guard.ts        # Route protection (CanActivateFn)
│   └── login.component.ts   # Login page
├── components/          # UI components (standalone)
├── services/            # Business logic and API calls
├── models/              # TypeScript interfaces
├── app.ts               # Root component (router-outlet only)
├── app.routes.ts        # Route definitions with lazy loading
├── app.config.ts        # Application configuration
├── home.component.ts    # Main mood board page
└── transloco-loader.ts  # i18n translation loader

server/
└── index.js             # Express backend with JWT auth middleware
```

## Key Components

### Input Flow
- `mood-input.component.ts` - Text input + example prompt chips
- Emits user prompt to parent `app.ts`

### Display Components
- `mood-board.component.ts` - Results container, orchestrates child components
- `color-palette.component.ts` - Color swatches with hex codes
- `fabric-list.component.ts` - Fabric recommendation cards
- `style-tags.component.ts` - Style keyword tag cloud
- `outfit-grid.component.ts` - Outfit suggestion grid

### Services
- `openai.service.ts` - OpenAI API integration, prompt engineering, response parsing

### Models
- `mood-board.model.ts` - TypeScript interfaces for `MoodBoard`, `Color`, `Fabric`, `OutfitItem`

## Authentication Flow

1. User navigates to protected route (`/`)
2. `authGuard` checks `AuthService.isAuthenticated()` signal
3. If not authenticated, guard calls `AuthService.verifyToken()` to validate stored token
4. If token invalid/missing, user redirected to `/login`
5. User submits credentials → `AuthService.login()` → backend `/api/auth/login`
6. Backend validates credentials, returns JWT (1-day expiry)
7. Token stored in `localStorage`, `isAuthenticated` signal set to `true`
8. User redirected to home page

### Token Handling
- `authInterceptor` attaches `Authorization: Bearer <token>` to all API requests
- Interceptor handles 401 responses by calling `AuthService.logout()`
- Logout clears token and redirects to login page

## Data Flow

1. User enters prompt in `MoodInputComponent`
2. `HomeComponent` receives prompt, calls `OpenAIService.generateMoodBoard()`
3. `authInterceptor` attaches JWT to request
4. Backend `authMiddleware` validates token, proxies to OpenAI
5. Service parses JSON response
6. `MoodBoardComponent` displays results via child components
7. `OpenAIService.generateOutfitImage()` generates outfit visualization

## i18n Architecture

- `@jsverse/transloco` for translations
- Translation files: `public/i18n/{en,pt}.json`
- `transloco-loader.ts` handles async loading
- `language-switcher.component.ts` toggles locale

## Backend Architecture

The Express server (`server/index.js`) provides:

### Endpoints
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/login` | POST | No | Validate credentials, return JWT |
| `/api/auth/verify` | GET | Yes | Validate token, return user info |
| `/api/chat/completions` | POST | Yes | Proxy to OpenAI Chat API |
| `/api/images/generations` | POST | Yes | Proxy to OpenAI Images API |

### Middleware
- `authMiddleware` - Validates JWT from `Authorization` header, attaches `req.user`

### Environment Variables
- `OPENAI_API_KEY` - OpenAI API key (required)
- `JWT_SECRET` - Secret for signing JWTs (required)
- `PORT` - Server port (default: 3000)
