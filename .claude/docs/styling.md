# Styling

## Stack

Angular 21 with Tailwind CSS v4 (via PostCSS plugin). Global styles in `src/styles.scss`.

## Conventions

- Utility-first styling with Tailwind classes directly in templates
- Design aesthetic: bold editorial (Vogue/Harper's Bazaar inspired)
- Fonts: Playfair Display (serif headings) + Inter (sans-serif body)
- Dark/light theme toggle via `ThemeService` — uses `data-theme` attribute on `<html>`
- Responsive design with Tailwind breakpoints

## File Organization

- Global styles: `src/styles.scss` (Tailwind imports, font declarations, theme variables)
- Component styles: Tailwind utility classes directly in component templates (no separate style files)
- Tailwind config: CSS-based `@theme` directives in `src/styles.scss` (v4 — no JS config file)
- PostCSS: `.postcssrc.json` with `@tailwindcss/postcss`

## Adding New Components

- Use Tailwind utility classes in templates — avoid custom CSS unless necessary
- Follow existing component patterns: standalone components with default change detection
- For theme-aware styles, reference theme CSS variables (e.g., `var(--theme-champagne)`) — the project uses `data-theme` attributes, not Tailwind's `dark:` variant
- Keep component styles scoped; use global styles only for app-wide concerns
