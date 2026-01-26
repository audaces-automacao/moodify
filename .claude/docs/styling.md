# Styling Guidelines

Moodify uses Tailwind CSS v4 with a bold editorial design inspired by Vogue/Harper's Bazaar.

## Tech Stack

- **Tailwind CSS v4** via PostCSS (`.postcssrc.json`)
- **Fonts**: Playfair Display (serif headlines) + Inter (sans-serif body)
- **Configuration**: Tailwind v4 uses CSS-based config, no `tailwind.config.js`

## Design Principles

### Editorial Aesthetic
- Bold typography with large serif headlines
- High contrast black/white base with accent colors
- Generous whitespace and breathing room
- Fashion-forward, magazine-quality visuals

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

### Color Palette
Components display dynamic color palettes from AI. Use:
- Hex codes from `MoodBoard.colors` for swatches
- Tailwind's color utilities for UI chrome

## File Structure

- Component styles: Inline in `.component.ts` or separate `.component.css`
- Global styles: `src/styles.css`
- Tailwind directives: Imported in styles.css

## Animations

Use Tailwind's transition utilities:
- `transition-all`, `duration-300`, `ease-in-out`
- `hover:` and `focus:` states for interactivity
