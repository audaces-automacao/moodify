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

  /**
   * Toggle between dark and light themes
   */
  toggleTheme(): void {
    const newTheme: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  /**
   * Set a specific theme
   */
  setTheme(theme: Theme): void {
    this.theme.set(theme);
    this.applyTheme(theme);
    this.persistTheme(theme);
  }

  /**
   * Get initial theme from storage, system preference, or default
   */
  private getInitialTheme(): Theme {
    // Check localStorage first
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }

    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }

    return DEFAULT_THEME;
  }

  /**
   * Apply theme to DOM by setting data-theme attribute
   */
  private applyTheme(theme: Theme): void {
    this.document.documentElement.setAttribute('data-theme', theme);
  }

  /**
   * Persist theme preference to localStorage
   */
  private persistTheme(theme: Theme): void {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
}
