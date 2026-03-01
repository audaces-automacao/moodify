import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { Theme, ThemeService } from '../services/theme.service';
import { ThemeSwitcherComponent } from './theme-switcher.component';

describe('ThemeSwitcherComponent', () => {
  let component: ThemeSwitcherComponent;
  let fixture: ComponentFixture<ThemeSwitcherComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let themeServiceMock: any;
  let themeSignal: ReturnType<typeof signal<Theme>>;

  function createComponent(initialTheme: Theme = 'dark') {
    themeSignal = signal<Theme>(initialTheme);
    themeServiceMock = {
      toggleTheme: vi.fn().mockName('ThemeService.toggleTheme'),
      theme: themeSignal,
    };

    TestBed.configureTestingModule({
      imports: [
        ThemeSwitcherComponent,
        TranslocoTestingModule.forRoot({
          langs: {
            en: {
              themeSwitcher: {
                switchToLight: 'Switch to light mode',
                switchToDark: 'Switch to dark mode',
              },
            },
          },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
      providers: [{ provide: ThemeService, useValue: themeServiceMock }],
    });

    fixture = TestBed.createComponent(ThemeSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  describe('when theme is dark', () => {
    beforeEach(() => {
      createComponent('dark');
    });

    it('should display sun icon', () => {
      const sunPath = fixture.nativeElement.querySelector('svg path[d*="M12 3v1"]');
      expect(sunPath).toBeTruthy();
    });

    it('should not display moon icon', () => {
      const moonPath = fixture.nativeElement.querySelector('svg path[d*="M20.354"]');
      expect(moonPath).toBeFalsy();
    });

    it('should have aria-label for switching to light mode', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-label')).toBe('Switch to light mode');
    });

    it('should have title for switching to light mode', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('title')).toBe('Switch to light mode');
    });
  });

  describe('when theme is light', () => {
    beforeEach(() => {
      createComponent('light');
    });

    it('should display moon icon', () => {
      const moonPath = fixture.nativeElement.querySelector('svg path[d*="M20.354"]');
      expect(moonPath).toBeTruthy();
    });

    it('should not display sun icon', () => {
      const sunPath = fixture.nativeElement.querySelector('svg path[d*="M12 3v1"]');
      expect(sunPath).toBeFalsy();
    });

    it('should have aria-label for switching to dark mode', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-label')).toBe('Switch to dark mode');
    });

    it('should have title for switching to dark mode', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('title')).toBe('Switch to dark mode');
    });
  });

  describe('interactions', () => {
    beforeEach(() => {
      createComponent('dark');
    });

    it('should call toggleTheme on button click', () => {
      const button = fixture.nativeElement.querySelector('button');
      button.click();
      expect(themeServiceMock.toggleTheme).toHaveBeenCalled();
    });

    it('should have correct styling classes', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button.classList.contains('glass-input')).toBe(true);
      expect(button.classList.contains('rounded')).toBe(true);
      expect(button.classList.contains('cursor-pointer')).toBe(true);
    });
  });
});
