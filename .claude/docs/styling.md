# Styling Guidelines

Moodify uses Tailwind CSS v4 with a bold editorial design inspired by Vogue/Harper's Bazaar.

## Tech Stack

- **Tailwind CSS v4** via PostCSS (`.postcssrc.json`), imported as `@use "tailwindcss"` in SCSS
- **Fonts**: Playfair Display (serif headlines) + Inter (sans-serif body)
- **Configuration**: Tailwind v4 uses CSS-based config, no `tailwind.config.js`

## Theme System

Dark/light theme via CSS custom properties in `src/styles.scss`:
- `--theme-*` variables for colors (void, obsidian, champagne, gold, etc.)
- `--glass-*` variables for glassmorphism effects
- Theme toggled via `data-theme` attribute on `<html>` element
- `theme-switcher.component.ts` handles toggle

## Design Principles

### Editorial Aesthetic
- Bold typography with large serif headlines
- High contrast with accent colors (champagne/gold on dark, dark on light)
- Generous whitespace and breathing room
- Glassmorphism effects for cards and inputs

### Typography Hierarchy
- Headlines: Playfair Display, large sizes, bold
- Body text: Inter, readable sizes, regular weight
- Use Tailwind's typography utilities for consistency

## Component Styling

### Tailwind-First Approach
Use Tailwind utility classes directly in templates. Avoid custom CSS unless necessary.

### Responsive Design
- Mobile-first approach
- Use Tailwind's responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Test on multiple viewport sizes

### Color Palette Display
Components display dynamic color palettes from AI. Use hex codes from `MoodBoard.colors` for swatches.

## File Structure

- Component styles: Inline in `.component.ts` or separate `.component.scss`
- Global styles: `src/styles.scss`
- Tailwind directives: Imported in styles.scss via `@use "tailwindcss"`

## Animations

Use Tailwind's transition utilities:
- `transition-all`, `duration-300`, `ease-in-out`
- `hover:` and `focus:` states for interactivity
