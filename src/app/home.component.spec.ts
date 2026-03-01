import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { of, throwError } from 'rxjs';
import { HomeComponent } from './home.component';
import { MoodBoardResponse } from './models/mood-board.model';
import { OpenAIService } from './services/openai.service';
import { AuthService } from './auth/auth.service';

const en = {
  header: {
    title: 'MOODIFY',
    subtitle: 'AI-Powered Fashion Mood Board Generator',
    logout: 'Logout',
    library: 'Library',
  },
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
    footer: '100% written by Claude Code',
    footerStack: 'Angular 21 + Tailwind CSS + OpenAI',
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
  outfitImage: {
    title: 'Outfit Visualization',
    altText: 'AI-generated outfit visualization',
    generating: 'Generating outfit visualization...',
    disclaimer: 'AI-generated image for inspiration purposes',
  },
  library: {
    saveButton: 'Save to Library',
    saveDialog: {
      title: 'Save Mood Board',
      nameLabel: 'Name',
      namePlaceholder: 'e.g., Summer Vacation Vibes',
      save: 'Save',
      cancel: 'Cancel',
    },
  },
};

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  let openAIServiceMock: any;
  let authServiceMock: any;
  /* eslint-enable @typescript-eslint/no-explicit-any */

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
    // jsdom does not implement scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();

    openAIServiceMock = {
      generateMoodBoard: vi.fn().mockName('OpenAIService.generateMoodBoard'),
      generateOutfitImage: vi.fn().mockName('OpenAIService.generateOutfitImage'),
    };
    openAIServiceMock.generateMoodBoard.mockReturnValue(of(mockMoodBoard));
    openAIServiceMock.generateOutfitImage.mockReturnValue(of('https://example.com/image.png'));

    authServiceMock = {
      logout: vi.fn().mockName('AuthService.logout'),
      isAuthenticated: vi.fn().mockName('AuthService.isAuthenticated'),
    };
    authServiceMock.isAuthenticated.mockReturnValue(true);

    // Mock localStorage
    vi.spyOn(localStorage, 'getItem').mockReturnValue('en');
    vi.spyOn(localStorage, 'setItem');

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        TranslocoTestingModule.forRoot({
          langs: { en },
          translocoConfig: {
            availableLangs: ['en'],
            defaultLang: 'en',
          },
        }),
      ],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: OpenAIService, useValue: openAIServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('MOODIFY');
  });

  describe('initial state', () => {
    it('should have correct default values', () => {
      expect(component.moodBoard()).toBeNull();
      expect(component.isLoading()).toBe(false);
      expect(component.error()).toBeNull();
      expect(component.examplePrompts()).toBeDefined();
    });

    it('should have correct default image state values', () => {
      expect(component.outfitImage()).toBeNull();
      expect(component.isImageLoading()).toBe(false);
      expect(component.imageError()).toBeNull();
    });
  });

  describe('generateMoodBoard', () => {
    it('should clear previous state and call service with prompt', () => {
      let subscribeCalled = false;
      openAIServiceMock.generateMoodBoard.mockReturnValue({
        subscribe: () => {
          subscribeCalled = true;
        },
      } as unknown as ReturnType<typeof of>);

      component.moodBoard.set(mockMoodBoard);
      component.error.set('Previous error');
      component.generateMoodBoard('test prompt');

      expect(component.moodBoard()).toBeNull();
      expect(component.error()).toBeNull();
      expect(openAIServiceMock.generateMoodBoard).toHaveBeenCalledWith('test prompt');
      expect(subscribeCalled).toBe(true);
    });

    it('should update state on success', () => {
      openAIServiceMock.generateMoodBoard.mockReturnValue(of(mockMoodBoard));
      component.generateMoodBoard('test');

      expect(component.moodBoard()).toEqual(mockMoodBoard);
      expect(component.isLoading()).toBe(false);
      expect(component.error()).toBeNull();
    });

    it('should update state on failure', () => {
      openAIServiceMock.generateMoodBoard.mockReturnValue(throwError(() => new Error('API Error')));
      component.generateMoodBoard('test');

      expect(component.error()).toBe('API Error');
      expect(component.isLoading()).toBe(false);
      expect(component.moodBoard()).toBeNull();
    });

    it('should reset image error state when generating new mood board', () => {
      component.imageError.set('Previous error');

      openAIServiceMock.generateMoodBoard.mockReturnValue(of(mockMoodBoard));
      component.generateMoodBoard('test');

      // Previous image error should be cleared
      expect(component.imageError()).toBeNull();
    });

    it('should trigger image generation on mood board success', () => {
      openAIServiceMock.generateMoodBoard.mockReturnValue(of(mockMoodBoard));
      component.generateMoodBoard('test');

      expect(openAIServiceMock.generateOutfitImage).toHaveBeenCalledWith(
        mockMoodBoard.outfitSuggestions,
        mockMoodBoard.styleKeywords,
      );
    });

    it('should update outfitImage on successful image generation', async () => {
      openAIServiceMock.generateMoodBoard.mockReturnValue(of(mockMoodBoard));
      openAIServiceMock.generateOutfitImage.mockReturnValue(of('https://example.com/image.png'));
      // Mock preloadImage to resolve immediately
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn(component as any, 'preloadImage').mockReturnValue(Promise.resolve());

      component.generateMoodBoard('test');
      await Promise.resolve(); // Flush microtask queue for the preloadImage promise

      expect(component.outfitImage()).toBe('https://example.com/image.png');
      expect(component.isImageLoading()).toBe(false);
    });

    it('should update imageError on image generation failure', () => {
      openAIServiceMock.generateMoodBoard.mockReturnValue(of(mockMoodBoard));
      openAIServiceMock.generateOutfitImage.mockReturnValue(
        throwError(() => new Error('Image generation failed')),
      );

      component.generateMoodBoard('test');

      expect(component.imageError()).toBe('Image generation failed');
      expect(component.isImageLoading()).toBe(false);
      expect(component.outfitImage()).toBeNull();
    });

    it('should not affect mood board display when image generation fails', () => {
      openAIServiceMock.generateMoodBoard.mockReturnValue(of(mockMoodBoard));
      openAIServiceMock.generateOutfitImage.mockReturnValue(
        throwError(() => new Error('Image error')),
      );

      component.generateMoodBoard('test');

      expect(component.moodBoard()).toEqual(mockMoodBoard);
      expect(component.error()).toBeNull();
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
