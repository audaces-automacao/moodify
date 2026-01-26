# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Commands

```bash
npm start          # Start dev server at http://localhost:4200
npm run build      # Production build (outputs to dist/)
npm run lint       # Run ESLint + Prettier
npm test           # Run tests in watch mode
npm run test:ci    # CI mode: single run with coverage
```

## Testing

**Run tests after any code changes to verify nothing is broken.**

For test patterns and examples, see [testing.md](.claude/docs/testing.md).

## Architecture

**Moodify** is an AI-powered fashion mood board generator built with Angular 21 and OpenAI.

### Tech Stack
- Angular 21 with standalone components and signals
- Tailwind CSS v4 + SCSS
- OpenAI GPT-4o for mood board generation
- Karma + Jasmine for testing

### Data Flow
1. `App` component holds main state (`moodBoard`, `isLoading`, `error` signals)
2. `MoodInputComponent` emits user prompts via `generate` output
3. `OpenAIService` calls GPT-4o API and returns typed `MoodBoardResponse`
4. `MoodBoardComponent` displays results via child components

For component patterns and detailed architecture, see [architecture.md](.claude/docs/architecture.md).

### API Configuration
OpenAI settings are in `src/environments/environment.ts`.

## Styling

Editorial/fashion magazine aesthetic (Vogue-inspired) with custom color tokens and typography.

For design system details, see [styling.md](.claude/docs/styling.md).

## Coding Guidelines

For architectural principles and best practices, see [coding-guidelines.md](.claude/docs/coding-guidelines.md).
