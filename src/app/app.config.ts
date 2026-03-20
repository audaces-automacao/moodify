import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTransloco } from '@jsverse/transloco';
import { routes } from './app.routes';
import { authInterceptor } from './auth/auth.interceptor';
import { TranslocoHttpLoader } from './transloco-loader';

export const AVAILABLE_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'pt-BR', label: 'Português' },
] as const;
export const DEFAULT_LANG = 'en';
export const LANGUAGE_STORAGE_KEY = 'preferredLanguage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideTransloco({
      config: {
        availableLangs: AVAILABLE_LANGUAGES.map(l => l.code),
        defaultLang: getDefaultLanguage(localStorage, navigator.language),
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};

export function getDefaultLanguage(storage: Storage, navigatorLang: string): string {
  const stored = storage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored && AVAILABLE_LANGUAGES.some(l => l.code === stored)) {
    return stored;
  }

  if (navigatorLang.startsWith('pt')) {
    return 'pt-BR';
  }

  return DEFAULT_LANG;
}
