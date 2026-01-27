import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideTransloco } from '@jsverse/transloco';
import { authInterceptor } from './auth/auth.interceptor';
import { routes } from './app.routes';
import { TranslocoHttpLoader } from './transloco-loader';

const AVAILABLE_LANGS = ['en', 'pt-BR'] as const;
const DEFAULT_LANG = 'en';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
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
