# Styling

## Stack

Angular 21 with Tailwind CSS v4 utilities and SCSS for component styles.

## Conventions

- Bold editorial design inspired by Vogue/Harper's Bazaar — high contrast, dramatic typography
- Fonts: Playfair Display (serif, headings/display) + Inter (sans-serif, body/UI)
- Tailwind CSS v4 for utility classes; SCSS for component-scoped styles (Angular `styleUrl`)
- Dark/light theme support via `ThemeService` — respect user's theme toggle preference

## File Organization

- Component styles co-located as SCSS files (e.g., `login.component.scss`)
- Global styles in `src/styles.scss`
- Tailwind configuration via CSS-based `@theme` in `src/styles.scss`
- Translation files in `public/i18n/` (en.json, pt-BR.json)

## Adding New Components

- Use Tailwind utilities for layout and spacing; SCSS for complex component-specific styles
- Follow the editorial design language: bold typography, generous whitespace, strong visual hierarchy
- Ensure all user-facing text uses transloco keys for i18n support
- Support both dark and light themes — test in both modes
