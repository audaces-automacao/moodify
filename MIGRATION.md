# Angular 17 to Angular 21 Migration Notes

## Migration Date
January 2026

## Version Changes

| Package | Before | After |
|---------|--------|-------|
| @angular/* | 17.3.12 | 21.1.1 |
| @angular/cli | 17.3.17 | 21.1.1 |
| TypeScript | 5.4.5 | 5.9.3 |
| Zone.js | 0.14.10 | 0.15.1 |
| RxJS | 7.8.0 | 7.8.0 (unchanged) |

## Build System Changes

- **Builder migrated**: `@angular-devkit/build-angular:browser` → `@angular/build:application`
- **Output path**: `dist/moodify` → `dist/moodify/browser`
- **Build tool**: Webpack → esbuild (significantly faster builds)
- **Package renamed**: `@angular-devkit/build-angular` → `@angular/build`

## TypeScript Configuration Changes

- `moduleResolution`: `node` → `bundler`
- `lib`: Updated to modern ES standards

## Code Modernization Applied

### Signal-based Inputs/Outputs
All components migrated from decorator-based to signal-based patterns:

```typescript
// Before (Angular 17)
@Input() isLoading = false;
@Output() submitPrompt = new EventEmitter<string>();

// After (Angular 21)
isLoading = input(false);
submitPrompt = output<string>();
```

Template usage changes from `isLoading` to `isLoading()`.

### Signal-based View Queries
```typescript
// Before
@ViewChild(MoodBoardInputComponent) inputComponent!: MoodBoardInputComponent;

// After
private inputComponent = viewChild.required(MoodBoardInputComponent);
// Usage: this.inputComponent().setPrompt(prompt)
```

### Dependency Injection
Services migrated from constructor injection to `inject()` function:

```typescript
// Before
constructor(private http: HttpClient) {}

// After
private http = inject(HttpClient);
```

### RxJS Lifecycle Management
LoadingSpinnerComponent refactored to use `takeUntilDestroyed`:

```typescript
// Before
ngOnInit(): void {
  this.intervalId = setInterval(() => { ... }, 2500);
}
ngOnDestroy(): void {
  clearInterval(this.intervalId);
}

// After
private destroyRef = inject(DestroyRef);

ngOnInit(): void {
  interval(2500)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => { ... });
}
// No ngOnDestroy needed - cleanup is automatic
```

## Test Runner Changes

- **Karma removed**: All Karma/Jasmine dependencies removed from package.json
- **No tests exist**: Project was configured with `skipTests: true`
- **Future tests**: Use Vitest (Angular 21's recommended test runner)

## Files Modified

### Configuration Files
- `package.json` - All dependency versions updated, Karma removed
- `angular.json` - Builder migrated, test architect removed
- `tsconfig.json` - moduleResolution and lib updated

### Components (signal inputs/outputs)
- `aesthetic-description.component.ts`
- `color-palette.component.ts`
- `error-message.component.ts`
- `example-prompts.component.ts`
- `fabric-recommendations.component.ts`
- `loading-spinner.component.ts`
- `mood-board-display.component.ts`
- `mood-board-input.component.ts`
- `outfit-suggestions.component.ts`
- `style-keywords.component.ts`
- `app.component.ts`

### Services (inject() function)
- `mood-board.service.ts`
- `openai.service.ts`

### Documentation
- `README.md` - Updated version requirements
- `.claude/CLAUDE.md` - Updated patterns documentation

## Angular 21 Features Not Adopted (Evaluate Later)

- **Zoneless change detection**: Kept Zone.js for stability
- **Signal Forms**: Project uses simple ngModel, not complex forms
- **Angular Aria**: No accessibility library needed currently

## Rollback Instructions

If needed, revert to the previous commit:
```bash
git checkout master
```

Or reset to a specific commit before the migration.
