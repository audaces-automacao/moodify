# Styling Guidelines

Design system and Tailwind CSS conventions for Moodify.

## Tailwind CSS v4

This project uses Tailwind CSS v4 with PostCSS integration.

## Conventions

### Utility-First Approach
- Prefer Tailwind utility classes over custom CSS
- Use component extraction for repeated patterns
- Keep custom CSS minimal

### Responsive Design
- Mobile-first approach
- Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

### Spacing and Layout
- Use consistent spacing scale
- Prefer flexbox and grid utilities
- Use `gap-*` for spacing between children

### Colors
- Use Tailwind's color palette
- Define custom colors in CSS variables if needed
- Maintain consistent color usage for states

## Component Patterns

### Buttons
Use consistent button styles across the application.

### Forms
Use Angular Forms with Tailwind styling for inputs.

### Cards and Containers
Use consistent padding and border radius.

## Accessibility

- Ensure sufficient color contrast
- Use semantic HTML elements
- Include focus states for interactive elements
