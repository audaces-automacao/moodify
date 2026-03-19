# Styling

## Stack

Angular 21 with Tailwind CSS v4, PostCSS, and SCSS for component styles.

## Conventions

- Utility-first styling with Tailwind CSS classes in templates
- Bold editorial design aesthetic (Vogue/Harper's Bazaar inspired)
- Fonts: Playfair Display (serif headings) + Inter (sans-serif body)
- Dark/light theme toggle via `ThemeService` — uses CSS class strategy on document root

## File Organization

- `src/styles.scss` — global styles, Tailwind directives, font imports
- Component-level SCSS via Angular's `inlineStyleLanguage: "scss"`
- `.postcssrc.json` — PostCSS config with Tailwind and autoprefixer
- `.prettierrc` — Prettier configured with Angular HTML parser

## Adding New Components

- Use Tailwind utility classes for layout and spacing
- Follow existing component patterns: standalone components with inline templates where appropriate
- Dark mode: use Tailwind's `dark:` variant for theme-aware styles
- Keep custom SCSS minimal — prefer Tailwind utilities over custom CSS
