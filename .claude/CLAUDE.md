# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Moodify is an AI-powered fashion mood board generator built with Angular 21. Users describe a style or occasion, and GPT-4 generates curated mood boards with color palettes, fabric recommendations, style keywords, and outfit suggestions.

## Commands

```bash
npm start          # Start dev server at localhost:4200
npm run build      # Production build (outputs to dist/moodify)
```

## Coding Guidelines

- **Follow existing patterns**: Match the codebase's architecture, naming conventions, and style; avoid introducing new patterns unless necessary.
- **Keep changes minimal**: Default to the simplest solution that works (KISS); keep diffs small and avoid speculative abstractions.
- **Prioritize readability**: Favor explicit control flow and clear data flow over cleverness; reduce duplication without sacrificing clarity.
- **Use domain-accurate names**: Prefer descriptive domain types over primitives; keep functions small and focused (SRP).
- **Minimize dependencies**: Prefer standard library and existing packages; avoid adding new dependencies without justification.
- **Comment intent, not code**: Only document non-obvious decisions, tradeoffs, or "why" - don't narrate what the code does.

## Architecture

### State Management
Uses Angular signals for reactive state. `MoodBoardService` is the central state container:
- Exposes read-only computed signals (`moodBoard`, `state`, `error`, `isLoading`, `hasResult`, `hasError`)
- Internal writable signals for state mutations
- App states: `idle` → `loading` → `success` | `error`

### Component Pattern
All components are standalone (no NgModules) using modern Angular 21 patterns:
- Signal-based inputs via `input()` function instead of `@Input()` decorator
- Signal-based outputs via `output()` function instead of `@Output()` decorator
- Signal-based view queries via `viewChild()` instead of `@ViewChild()` decorator
- The app uses a flat component structure under `src/app/components/` with single-responsibility components

### API Integration
`OpenAIService` handles GPT-4 communication:
- Sends structured prompts expecting JSON response format
- Parses and validates API responses against `MoodBoard` interface
- Handles specific error types (network, auth, rate limit, parse errors)

### Configuration
Environment files control API configuration:
- `src/environments/environment.development.ts` - dev config with API key (gitignored)
- `src/environments/environment.ts` - production config (API key injected at build)
- Angular file replacement swaps these per build configuration

## Angular CLI Settings

The project is configured in `angular.json` to generate:
- Standalone components, directives, and pipes by default
- Skip test file generation for all schematics

## Type System

Core types in `src/app/models/mood-board.model.ts`:
- `MoodBoard` - complete mood board with all sections
- `MoodBoardAPIResponse` - raw GPT response structure (before transformation)
- `AppState` - union type for UI state machine
- `AppError` - typed error with user-facing message and retry flag
