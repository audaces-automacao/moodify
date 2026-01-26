# Architecture

Project structure and data flow for Moodify.

## Project Structure

```
src/
├── app/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route-level components
│   ├── services/       # Business logic and API calls
│   ├── models/         # TypeScript interfaces
│   └── utils/          # Helper functions
├── assets/
│   └── i18n/           # Translation files
└── styles.css          # Global styles and Tailwind
```

## Angular Architecture

### Standalone Components
All components use standalone architecture (no NgModules).

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}
```

### State Management
Use Angular signals for reactive state management.

### Routing
Routes defined in `app.routes.ts` with lazy loading for pages.

## Internationalization

Uses @jsverse/transloco for translations.

- Translation files in `src/assets/i18n/`
- Use `translate` pipe in templates
- Support for runtime language switching

## Data Flow

1. Components receive data via inputs or services
2. Services handle API communication
3. State managed with signals
4. Templates render reactive data
