# Styling Guidelines

Moodify uses Tailwind CSS v4 with a bold editorial design inspired by Vogue/Harper's Bazaar.

## Tech Stack

- **Tailwind CSS v4** with PostCSS
- **Fonts**: Playfair Display (serif headings) + Inter (sans-serif body)
- **Component styles**: Inline Tailwind classes in templates

## Design System

### Typography
- Headings: `font-serif` (Playfair Display)
- Body text: `font-sans` (Inter)
- Editorial aesthetic with high contrast

### Color Usage
- Generated mood boards display 5-6 curated colors with hex codes
- Use semantic color naming in dynamic content

### Layout Patterns
- Responsive grid layouts for mood board displays
- Card-based UI for fabric and outfit suggestions
- Chip/tag styling for style keywords

## File Structure

```
src/
├── styles.scss        # Global styles, font imports
├── app/
│   ├── app.scss       # App-level styles
│   └── components/    # Component templates with Tailwind classes
public/
└── favicon.ico
```

## Conventions

### Tailwind Classes
- Use utility classes directly in templates
- Prefer responsive prefixes (`sm:`, `md:`, `lg:`)
- Group related utilities logically

### Custom Styles
- Add global styles to `src/styles.scss`
- Component-specific styles in co-located `.scss` files
- Avoid `!important` overrides

### Responsive Design
- Mobile-first approach
- Test at common breakpoints (sm, md, lg, xl)
