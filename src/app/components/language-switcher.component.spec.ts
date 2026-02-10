import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule, TranslocoService } from '@jsverse/transloco';
import { LanguageSwitcherComponent } from './language-switcher.component';

describe('LanguageSwitcherComponent', () => {
  let component: LanguageSwitcherComponent;
  let fixture: ComponentFixture<LanguageSwitcherComponent>;
  let translocoService: TranslocoService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let localStorageSpy: any;

  beforeEach(async () => {
    // Create localStorage mock
    localStorageSpy = {
      getItem: vi.fn().mockName('localStorage.getItem'),
      setItem: vi.fn().mockName('localStorage.setItem'),
    };
    localStorageSpy.getItem.mockReturnValue('en');

    // Replace localStorage
    vi.spyOn(window, 'localStorage', 'get').mockReturnValue(localStorageSpy);

    await TestBed.configureTestingModule({
      imports: [
        LanguageSwitcherComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: {}, 'pt-BR': {} },
          translocoConfig: { availableLangs: ['en', 'pt-BR'], defaultLang: 'en' },
        }),
      ],
    }).compileComponents();

    translocoService = TestBed.inject(TranslocoService);
    vi.spyOn(translocoService, 'setActiveLang');

    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentLang from localStorage', () => {
    expect(localStorageSpy.getItem).toHaveBeenCalledWith('preferredLanguage');
    expect(component.currentLang()).toBe('en');
  });

  it('should render select with all available languages', () => {
    const select = fixture.nativeElement.querySelector('select');
    const options = fixture.nativeElement.querySelectorAll('option');
    const html = fixture.nativeElement.innerHTML;

    expect(select).toBeTruthy();
    expect(options.length).toBe(2);
    expect(html).toContain('English');
    expect(html).toContain('Português');
    expect(options[0].value).toBe('en');
    expect(options[1].value).toBe('pt-BR');
  });

  it('should update language and persist to localStorage on switch', () => {
    const select = fixture.nativeElement.querySelector('select');
    select.value = 'pt-BR';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(translocoService.setActiveLang).toHaveBeenCalledWith('pt-BR');
    expect(localStorageSpy.setItem).toHaveBeenCalledWith('preferredLanguage', 'pt-BR');
  });

  it('should call setActiveLang when switchLanguage is invoked directly', () => {
    const mockEvent = { target: { value: 'pt-BR' } } as unknown as Event;
    component.switchLanguage(mockEvent);
    expect(translocoService.setActiveLang).toHaveBeenCalledWith('pt-BR');
  });

  it('should have available langs defined', () => {
    expect(component.availableLangs).toEqual([
      { code: 'en', label: 'English' },
      { code: 'pt-BR', label: 'Português' },
    ]);
  });

  it('should render dropdown icon', () => {
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
  });
});

describe('LanguageSwitcherComponent initialization', () => {
  function createComponent(
    storedLang: string | null,
    defaultLang: string,
  ): {
    component: LanguageSwitcherComponent;
    fixture: ComponentFixture<LanguageSwitcherComponent>;
  } {
    const localStorageSpy = {
      getItem: vi.fn().mockName('localStorage.getItem'),
      setItem: vi.fn().mockName('localStorage.setItem'),
    };
    localStorageSpy.getItem.mockReturnValue(storedLang);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn(window, 'localStorage', 'get').mockReturnValue(localStorageSpy as any);

    TestBed.configureTestingModule({
      imports: [
        LanguageSwitcherComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: {}, 'pt-BR': {} },
          translocoConfig: { availableLangs: ['en', 'pt-BR'], defaultLang },
        }),
      ],
    });

    const fixture = TestBed.createComponent(LanguageSwitcherComponent);
    fixture.detectChanges();
    return { component: fixture.componentInstance, fixture };
  }

  it('should initialize with pt-BR from localStorage', () => {
    const { component } = createComponent('pt-BR', 'pt-BR');
    expect(component.currentLang()).toBe('pt-BR');
  });

  it('should default to en when localStorage is empty', () => {
    const { component } = createComponent(null, 'en');
    expect(component.currentLang()).toBe('en');
  });
});
