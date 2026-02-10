import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const translations = {
    header: {
      title: 'MOODIFY',
      subtitle: 'AI-Powered Fashion Mood Board Generator',
    },
  };

  beforeEach(async () => {
    // Mock localStorage for LanguageSwitcherComponent
    vi.spyOn(localStorage, 'getItem').mockReturnValue('en');
    vi.spyOn(localStorage, 'setItem');

    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: translations },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const title = fixture.nativeElement.querySelector('h1');
    expect(title.textContent).toContain('MOODIFY');
  });

  it('should render subtitle', () => {
    const subtitle = fixture.nativeElement.querySelector('p');
    expect(subtitle.textContent).toContain('AI-Powered Fashion Mood Board Generator');
  });

  it('should render language switcher component', () => {
    const languageSwitcher = fixture.nativeElement.querySelector('app-language-switcher');
    expect(languageSwitcher).toBeTruthy();
  });

  it('should have header element with border', () => {
    const header = fixture.nativeElement.querySelector('header');
    expect(header).toBeTruthy();
    expect(header.classList).toContain('border-b');
  });

  it('should have title with gradient class', () => {
    const title = fixture.nativeElement.querySelector('h1');
    expect(title.classList).toContain('text-gradient-gold');
  });

  it('should have title with animation class', () => {
    const title = fixture.nativeElement.querySelector('h1');
    expect(title.classList).toContain('animate-fade-in');
  });

  it('should have subtitle with animation class', () => {
    const subtitle = fixture.nativeElement.querySelector('p');
    expect(subtitle.classList).toContain('animate-fade-in');
  });
});
