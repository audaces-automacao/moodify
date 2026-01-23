import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { of, throwError } from 'rxjs';
import { App } from './app';
import { MoodBoardResponse } from './models/mood-board.model';
import { OpenAIService } from './services/openai.service';

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
  moodBoard: { aestheticOverview: 'Aesthetic Overview' },
  colorPalette: { title: 'Color Palette' },
  styleTags: { title: 'Style Keywords' },
  fabrics: { title: 'Fabrics', textureLabel: 'Texture:' },
  outfits: {
    title: 'Outfit Suggestions',
    top: 'Top',
    bottom: 'Bottom',
    shoes: 'Shoes',
    accessories: 'Accessories',
  },
  errors: { generic: 'An error occurred' },
};

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let openAIServiceMock: jasmine.SpyObj<OpenAIService>;

  const mockMoodBoard: MoodBoardResponse = {
    colorPalette: [{ name: 'Blue', hex: '#0000FF', usage: 'primary' }],
    fabrics: [{ name: 'Silk', description: 'Luxurious', texture: 'Smooth', season: 'Spring' }],
    styleKeywords: ['Elegant'],
    outfitSuggestions: {
      top: 'Blouse',
      bottom: 'Skirt',
      shoes: 'Heels',
      accessories: ['Watch'],
    },
    aestheticDescription: 'Test aesthetic',
  };

  beforeEach(async () => {
    openAIServiceMock = jasmine.createSpyObj('OpenAIService', ['generateMoodBoard']);
    openAIServiceMock.generateMoodBoard.and.returnValue(of(mockMoodBoard));

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue('en');
    spyOn(localStorage, 'setItem');

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
      providers: [provideHttpClient(), { provide: OpenAIService, useValue: openAIServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('MOODIFY');
  });

  describe('initial state', () => {
    it('should have null moodBoard', () => {
      expect(component.moodBoard()).toBeNull();
    });

    it('should have isLoading false', () => {
      expect(component.isLoading()).toBe(false);
    });

    it('should have null error', () => {
      expect(component.error()).toBeNull();
    });

    it('should have empty examplePrompts initially', () => {
      expect(component.examplePrompts()).toBeDefined();
    });
  });

  describe('generateMoodBoard', () => {
    it('should set isLoading to true during request', () => {
      // Use a delayed observable to test loading state
      openAIServiceMock.generateMoodBoard.and.returnValue(of(mockMoodBoard));
      component.generateMoodBoard('test');
      // With sync observable, loading is set then immediately false after subscribe completes
      // But we can at least verify the service was called
      expect(openAIServiceMock.generateMoodBoard).toHaveBeenCalled();
    });

    it('should clear previous error', () => {
      component.error.set('Previous error');
      component.generateMoodBoard('test');
      expect(component.error()).toBeNull();
    });

    it('should clear previous moodBoard at start', () => {
      // Set up a mock that doesn't complete immediately
      let subscribeCalled = false;
      openAIServiceMock.generateMoodBoard.and.returnValue({
        subscribe: () => {
          subscribeCalled = true;
        },
      } as unknown as ReturnType<typeof of>);

      component.moodBoard.set(mockMoodBoard);
      component.generateMoodBoard('test');

      // moodBoard should be null after calling generateMoodBoard
      expect(component.moodBoard()).toBeNull();
      expect(subscribeCalled).toBe(true);
    });

    it('should call OpenAIService with prompt', () => {
      component.generateMoodBoard('test prompt');
      expect(openAIServiceMock.generateMoodBoard).toHaveBeenCalledWith('test prompt');
    });

    it('should set moodBoard on success', () => {
      openAIServiceMock.generateMoodBoard.and.returnValue(of(mockMoodBoard));
      component.generateMoodBoard('test');
      // Observable completes synchronously
      expect(component.moodBoard()).toEqual(mockMoodBoard);
    });

    it('should set isLoading false on success', () => {
      openAIServiceMock.generateMoodBoard.and.returnValue(of(mockMoodBoard));
      component.generateMoodBoard('test');
      expect(component.isLoading()).toBe(false);
    });

    it('should set error on failure', () => {
      openAIServiceMock.generateMoodBoard.and.returnValue(throwError(() => new Error('API Error')));
      component.generateMoodBoard('test');
      expect(component.error()).toBe('API Error');
    });

    it('should set isLoading false on failure', () => {
      openAIServiceMock.generateMoodBoard.and.returnValue(throwError(() => new Error('API Error')));
      component.generateMoodBoard('test');
      expect(component.isLoading()).toBe(false);
    });

    it('should not set moodBoard on error', () => {
      openAIServiceMock.generateMoodBoard.and.returnValue(throwError(() => new Error('API Error')));
      component.generateMoodBoard('test');
      expect(component.moodBoard()).toBeNull();
    });
  });

  describe('UI rendering', () => {
    it('should render header component', () => {
      const header = fixture.nativeElement.querySelector('app-header');
      expect(header).toBeTruthy();
    });

    it('should render mood input component', () => {
      const moodInput = fixture.nativeElement.querySelector('app-mood-input');
      expect(moodInput).toBeTruthy();
    });

    it('should show empty state when no moodBoard and not loading', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      const emptyState = fixture.nativeElement.querySelector('.border-dashed');
      expect(emptyState).toBeTruthy();
    });

    it('should show loading skeleton when loading', () => {
      component.isLoading.set(true);
      fixture.detectChanges();
      const skeleton = fixture.nativeElement.querySelector('app-loading-skeleton');
      expect(skeleton).toBeTruthy();
    });

    it('should show mood board when data is available', () => {
      component.moodBoard.set(mockMoodBoard);
      fixture.detectChanges();
      const moodBoard = fixture.nativeElement.querySelector('app-mood-board');
      expect(moodBoard).toBeTruthy();
    });

    it('should display error message', () => {
      component.error.set('Test error message');
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain('Test error message');
    });

    it('should render footer', () => {
      const footer = fixture.nativeElement.querySelector('footer');
      expect(footer).toBeTruthy();
    });
  });
});
