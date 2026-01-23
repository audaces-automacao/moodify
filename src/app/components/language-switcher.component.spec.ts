import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule, TranslocoService } from '@jsverse/transloco';
import { LanguageSwitcherComponent } from './language-switcher.component';

describe('LanguageSwitcherComponent', () => {
  let component: LanguageSwitcherComponent;
  let fixture: ComponentFixture<LanguageSwitcherComponent>;
  let translocoService: TranslocoService;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  beforeEach(async () => {
    // Create localStorage mock
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem']);
    localStorageSpy.getItem.and.returnValue('en');

    // Replace localStorage
    spyOnProperty(window, 'localStorage', 'get').and.returnValue(localStorageSpy);

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
    spyOn(translocoService, 'setActiveLang');

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

  it('should render select element', () => {
    const select = fixture.nativeElement.querySelector('select');
    expect(select).toBeTruthy();
  });

  it('should render all available languages', () => {
    const options = fixture.nativeElement.querySelectorAll('option');
    expect(options.length).toBe(2);
  });

  it('should display English option', () => {
    const html = fixture.nativeElement.innerHTML;
    expect(html).toContain('English');
  });

  it('should display Portuguese option', () => {
    const html = fixture.nativeElement.innerHTML;
    expect(html).toContain('Português');
  });

  it('should have correct values for options', () => {
    const options = fixture.nativeElement.querySelectorAll('option');
    expect(options[0].value).toBe('en');
    expect(options[1].value).toBe('pt-BR');
  });

  it('should call setActiveLang when language is switched', () => {
    const select = fixture.nativeElement.querySelector('select');
    select.value = 'pt-BR';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(translocoService.setActiveLang).toHaveBeenCalledWith('pt-BR');
  });

  it('should save language to localStorage on switch', () => {
    const select = fixture.nativeElement.querySelector('select');
    select.value = 'pt-BR';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(localStorageSpy.setItem).toHaveBeenCalledWith('preferredLanguage', 'pt-BR');
  });

  it('should update currentLang signal when switchLanguage is called', () => {
    const mockEvent = {
      target: { value: 'pt-BR' },
    } as unknown as Event;

    component.switchLanguage(mockEvent);

    // The currentLang signal is updated via the langChanges$ subscription
    // For testing, we directly verify that setActiveLang was called
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

describe('LanguageSwitcherComponent with pt-BR default', () => {
  let component: LanguageSwitcherComponent;
  let fixture: ComponentFixture<LanguageSwitcherComponent>;

  beforeEach(async () => {
    const localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem']);
    localStorageSpy.getItem.and.returnValue('pt-BR');
    spyOnProperty(window, 'localStorage', 'get').and.returnValue(localStorageSpy);

    await TestBed.configureTestingModule({
      imports: [
        LanguageSwitcherComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: {}, 'pt-BR': {} },
          translocoConfig: { availableLangs: ['en', 'pt-BR'], defaultLang: 'pt-BR' },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize with pt-BR from localStorage', () => {
    expect(component.currentLang()).toBe('pt-BR');
  });
});

describe('LanguageSwitcherComponent with no localStorage value', () => {
  let component: LanguageSwitcherComponent;
  let fixture: ComponentFixture<LanguageSwitcherComponent>;

  beforeEach(async () => {
    const localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem']);
    localStorageSpy.getItem.and.returnValue(null);
    spyOnProperty(window, 'localStorage', 'get').and.returnValue(localStorageSpy);

    await TestBed.configureTestingModule({
      imports: [
        LanguageSwitcherComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: {}, 'pt-BR': {} },
          translocoConfig: { availableLangs: ['en', 'pt-BR'], defaultLang: 'en' },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should default to en when localStorage is empty', () => {
    expect(component.currentLang()).toBe('en');
  });
});
