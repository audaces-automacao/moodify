import { TestBed } from '@angular/core/testing';
import { TRANSLOCO_CONFIG, TranslocoConfig } from '@jsverse/transloco';

describe('app.config', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe('getDefaultLanguage', () => {
    it('should return stored language when valid', async () => {
      const mockStorage = createMockLocalStorage('pt-BR');
      vi.stubGlobal('localStorage', mockStorage);
      vi.stubGlobal('navigator', { language: 'en-US' });

      const defaultLang = await resolveDefaultLang();

      expect(defaultLang).toBe('pt-BR');
    });

    it('should detect Portuguese browser language', async () => {
      const mockStorage = createMockLocalStorage(null);
      vi.stubGlobal('localStorage', mockStorage);
      vi.stubGlobal('navigator', { language: 'pt' });

      const defaultLang = await resolveDefaultLang();

      expect(defaultLang).toBe('pt-BR');
    });

    it('should detect pt-BR browser language', async () => {
      const mockStorage = createMockLocalStorage(null);
      vi.stubGlobal('localStorage', mockStorage);
      vi.stubGlobal('navigator', { language: 'pt-BR' });

      const defaultLang = await resolveDefaultLang();

      expect(defaultLang).toBe('pt-BR');
    });

    it('should default to English for non-Portuguese browser language', async () => {
      const mockStorage = createMockLocalStorage(null);
      vi.stubGlobal('localStorage', mockStorage);
      vi.stubGlobal('navigator', { language: 'fr-FR' });

      const defaultLang = await resolveDefaultLang();

      expect(defaultLang).toBe('en');
    });

    it('should ignore invalid stored language', async () => {
      const mockStorage = createMockLocalStorage('invalid-lang');
      vi.stubGlobal('localStorage', mockStorage);
      vi.stubGlobal('navigator', { language: 'en-US' });

      const defaultLang = await resolveDefaultLang();

      expect(defaultLang).toBe('en');
    });
  });

  describe('exports', () => {
    it('should export correct available languages', async () => {
      const mockStorage = createMockLocalStorage(null);
      vi.stubGlobal('localStorage', mockStorage);
      vi.stubGlobal('navigator', { language: 'en-US' });

      const { AVAILABLE_LANGUAGES } = await import('./app.config');
      expect(AVAILABLE_LANGUAGES).toEqual([
        { code: 'en', label: 'English' },
        { code: 'pt-BR', label: 'Português' },
      ]);
    });

    it('should export correct language storage key', async () => {
      const mockStorage = createMockLocalStorage(null);
      vi.stubGlobal('localStorage', mockStorage);
      vi.stubGlobal('navigator', { language: 'en-US' });

      const { LANGUAGE_STORAGE_KEY } = await import('./app.config');
      expect(LANGUAGE_STORAGE_KEY).toBe('preferredLanguage');
    });
  });
});

function createMockLocalStorage(preferredLang: string | null) {
  return {
    getItem: vi.fn().mockReturnValue(preferredLang),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    length: 0,
    key: vi.fn(),
  };
}

async function resolveDefaultLang(): Promise<string> {
  const { appConfig } = await import('./app.config');

  TestBed.resetTestingModule();
  TestBed.configureTestingModule({ providers: appConfig.providers });
  const config = TestBed.inject<TranslocoConfig>(TRANSLOCO_CONFIG);
  return config.defaultLang!;
}
