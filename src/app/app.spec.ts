import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { App } from './app';

const en = {
  header: { title: 'MOODIFY', subtitle: 'AI-Powered Fashion Mood Board Generator' },
  moodInput: {
    label: 'Describe Your Style',
    placeholder: 'e.g., Parisian chic...',
    generateButton: 'Generate Mood Board',
    generatingButton: 'Generating...',
    examplesTitle: 'Try an Example',
  },
  examples: {
    parisian: 'Parisian chic',
    coastal: 'Coastal grandmother',
    '90s': '90s minimalism',
    darkAcademia: 'Dark academia',
    disco: 'Disco glam',
  },
  app: {
    errorLabel: 'Error',
    emptyState: 'Your mood board will appear here',
    emptyHint: 'Enter a style description above',
    footer: 'Built with Angular 21 + Tailwind CSS + OpenAI',
  },
  errors: { generic: 'An error occurred' },
};

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        TranslocoTestingModule.forRoot({
          langs: { en },
          translocoConfig: {
            availableLangs: ['en'],
            defaultLang: 'en',
          },
        }),
      ],
      providers: [provideHttpClient()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('MOODIFY');
  });
});
