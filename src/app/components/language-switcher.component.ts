import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-language-switcher',
  template: `
    <div class="relative">
      <select
        (change)="switchLanguage($event)"
        class="glass-input appearance-none text-luxury-cream text-xs uppercase tracking-widest
               px-3 py-2 pr-8 cursor-pointer rounded
               hover:border-luxury-champagne/50 transition-all"
      >
        @for (lang of availableLangs; track lang.code) {
          <option
            [value]="lang.code"
            [selected]="lang.code === currentLang()"
            class="bg-luxury-obsidian text-luxury-cream"
          >
            {{ lang.label }}
          </option>
        }
      </select>
      <span
        class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-luxury-champagne"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </span>
    </div>
  `,
})
export class LanguageSwitcherComponent implements OnInit {
  private transloco = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);

  availableLangs = [
    { code: 'en', label: 'English' },
    { code: 'pt-BR', label: 'Português' },
  ];

  // Initialize from localStorage directly (same source as app.config.ts)
  currentLang = signal(localStorage.getItem('preferredLanguage') || 'en');

  ngOnInit() {
    // Subscribe to language changes for when user switches language
    this.transloco.langChanges$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(lang => {
      this.currentLang.set(lang);
    });
  }

  switchLanguage(event: Event) {
    const select = event.target as HTMLSelectElement;
    const lang = select.value;
    this.transloco.setActiveLang(lang);
    localStorage.setItem('preferredLanguage', lang);
  }
}
