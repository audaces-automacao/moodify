import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from './transloco-loader';

const AVAILABLE_LANGS = ['en', 'pt-BR'] as const;
const DEFAULT_LANG = 'en';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: [...AVAILABLE_LANGS],
        defaultLang: getDefaultLanguage(),
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};

function getDefaultLanguage(): string {
  const stored = localStorage.getItem('preferredLanguage');
  if (stored && AVAILABLE_LANGS.includes(stored as (typeof AVAILABLE_LANGS)[number])) {
    return stored;
  }

  if (navigator.language.startsWith('pt')) {
    return 'pt-BR';
  }

  return DEFAULT_LANG;
}
