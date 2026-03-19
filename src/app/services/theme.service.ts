import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'preferredTheme';
const DEFAULT_THEME: Theme = 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private document = inject(DOCUMENT);

  /** Current active theme as a signal for reactive UI updates */
  readonly theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    // Apply theme on service initialization
    this.applyTheme(this.theme());
  }

  toggleTheme(): void {
    const newTheme: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
    this.applyTheme(theme);
    this.persistTheme(theme);
  }

  private getInitialTheme(): Theme {
    const win = this.document.defaultView;

    const stored = win?.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }

    if (win?.matchMedia) {
      const prefersDark = win.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }

    return DEFAULT_THEME;
  }

  private applyTheme(theme: Theme): void {
    this.document.documentElement.setAttribute('data-theme', theme);
  }

  private persistTheme(theme: Theme): void {
    this.document.defaultView?.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
}
