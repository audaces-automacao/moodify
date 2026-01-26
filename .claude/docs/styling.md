# Styling Guide

This document describes the design system and styling conventions for Moodify.

## Design Aesthetic

Moodify uses an editorial/fashion magazine aesthetic, inspired by publications like Vogue.

- Clean, minimal layouts with generous whitespace
- High contrast typography
- Subtle animations and transitions
- Luxurious feel with gold accents

## Color Tokens

Custom color tokens defined in the Tailwind configuration:

| Token | Usage |
|-------|-------|
| `editorial-black` | Primary text, headers |
| `editorial-white` | Backgrounds, contrast text |
| `editorial-charcoal` | Secondary text, borders |
| `editorial-gold` | Accents, highlights, CTAs |
| `editorial-cream` | Subtle backgrounds, cards |

## Typography

| Font | Usage |
|------|-------|
| **Playfair Display** | Serif headings, editorial titles |
| **Inter** | Sans-serif body text, UI elements |

## Styling Approach

- **Tailwind CSS v4**: Utility classes for layout, spacing, colors
- **SCSS**: Component-specific styles, complex animations
- **CSS Variables**: Theme tokens for consistency

## File Locations

- Global styles: `src/styles.scss`
- Tailwind config: `tailwind.config.js`
- Component styles: Inline or `*.component.scss` files
