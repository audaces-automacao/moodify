import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let localStorageSpy: any;

  function createService(storedTheme: string | null, prefersDark = true): ThemeService {
    localStorageSpy = {
      getItem: vi.fn().mockName('localStorage.getItem'),
      setItem: vi.fn().mockName('localStorage.setItem'),
    };
    localStorageSpy.getItem.mockReturnValue(storedTheme);
    vi.spyOn(window, 'localStorage', 'get').mockReturnValue(localStorageSpy);

    // Mock matchMedia (jsdom does not implement it)
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        matches: prefersDark,
      } as MediaQueryList)
    );

    TestBed.configureTestingModule({
      providers: [ThemeService],
    });

    return TestBed.inject(ThemeService);
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('initialization', () => {
    it('should be created', () => {
      service = createService('dark');
      expect(service).toBeTruthy();
    });

    it('should use stored theme from localStorage when available', () => {
      service = createService('light');
      expect(service.theme()).toBe('light');
    });

    it('should use dark theme from localStorage', () => {
      service = createService('dark');
      expect(service.theme()).toBe('dark');
    });

    it('should default to dark when system prefers dark and no stored preference', () => {
      service = createService(null, true);
      expect(service.theme()).toBe('dark');
    });

    it('should default to light when system prefers light and no stored preference', () => {
      service = createService(null, false);
      expect(service.theme()).toBe('light');
    });

    it('should apply theme to document element on creation', () => {
      service = createService('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from dark to light', () => {
      service = createService('dark');
      service.toggleTheme();
      expect(service.theme()).toBe('light');
    });

    it('should toggle from light to dark', () => {
      service = createService('light');
      service.toggleTheme();
      expect(service.theme()).toBe('dark');
    });

    it('should persist theme to localStorage after toggle', () => {
      service = createService('dark');
      service.toggleTheme();
      expect(localStorageSpy.setItem).toHaveBeenCalledWith('preferredTheme', 'light');
    });

    it('should update data-theme attribute after toggle', () => {
      service = createService('dark');
      service.toggleTheme();
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });

  describe('setTheme', () => {
    it('should set theme to light', () => {
      service = createService('dark');
      service.setTheme('light');
      expect(service.theme()).toBe('light');
    });

    it('should set theme to dark', () => {
      service = createService('light');
      service.setTheme('dark');
      expect(service.theme()).toBe('dark');
    });

    it('should update data-theme attribute', () => {
      service = createService('dark');
      service.setTheme('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('should persist theme to localStorage', () => {
      service = createService('dark');
      service.setTheme('light');
      expect(localStorageSpy.setItem).toHaveBeenCalledWith('preferredTheme', 'light');
    });
  });
});
