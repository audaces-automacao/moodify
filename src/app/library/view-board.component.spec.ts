import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router, convertToParamMap } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { ViewBoardComponent } from './view-board.component';
import { MoodBoardStorageService } from '../services/mood-board-storage.service';
import { SavedMoodBoard } from '../models/mood-board.model';

describe('ViewBoardComponent', () => {
  let component: ViewBoardComponent;
  let fixture: ComponentFixture<ViewBoardComponent>;
  let mockStorage: jasmine.SpyObj<MoodBoardStorageService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockBoard: SavedMoodBoard = {
    id: 'test-id-1',
    name: 'Summer Vibes',
    prompt: 'bohemian summer style',
    moodBoard: {
      colorPalette: [{ name: 'Coral', hex: '#FF6B6B', usage: 'primary' }],
      fabrics: [{ name: 'Linen', description: 'Light', texture: 'Soft', season: 'Summer' }],
      styleKeywords: ['bohemian', 'relaxed'],
      outfitSuggestions: {
        top: 'Flowy blouse',
        bottom: 'Wide leg pants',
        shoes: 'Sandals',
        accessories: ['Straw bag'],
      },
      aestheticDescription: 'A breezy, bohemian look.',
    },
    outfitImageUrl: 'https://example.com/image.png',
    isFavorite: false,
    createdAt: '2024-06-15T10:30:00.000Z',
    updatedAt: '2024-06-15T10:30:00.000Z',
  };

  const translations = {
    header: { title: 'MOODIFY', subtitle: 'AI Fashion', logout: 'Logout', library: 'Library' },
    library: {
      viewBoard: {
        backToLibrary: 'Back to Library',
        savedOn: 'Saved on {{ date }}',
        prompt: 'Original prompt',
        favorite: 'Add to Favorites',
        unfavorite: 'Remove from Favorites',
      },
    },
    moodBoard: { aestheticOverview: 'Aesthetic Overview' },
    colorPalette: { title: 'Color Palette' },
    styleTags: { title: 'Style Tags' },
    fabrics: { title: 'Fabrics', textureLabel: 'Texture:' },
    outfits: {
      title: 'Outfit Suggestions',
      top: 'Top',
      bottom: 'Bottom',
      shoes: 'Shoes',
      outerwear: 'Outerwear',
      accessories: 'Accessories',
    },
    outfitImage: {
      title: 'Outfit Visualization',
      altText: 'AI-generated outfit visualization',
      generating: 'Generating outfit visualization...',
      disclaimer: 'AI-generated image for inspiration purposes',
    },
    app: { footer: 'Footer' },
  };

  async function createComponent(boardId: string | null, board: SavedMoodBoard | undefined) {
    // Mock localStorage for LanguageSwitcherComponent
    spyOn(localStorage, 'getItem').and.returnValue('en');
    spyOn(localStorage, 'setItem');

    mockStorage = jasmine.createSpyObj('MoodBoardStorageService', ['getById', 'toggleFavorite']);
    mockStorage.getById.and.returnValue(board);

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ViewBoardComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: translations },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
      providers: [
        provideRouter([]),
        { provide: MoodBoardStorageService, useValue: mockStorage },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap(boardId ? { id: boardId } : {}),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', async () => {
    await createComponent('test-id-1', mockBoard);
    expect(component).toBeTruthy();
  });

  it('should load board from storage on init', async () => {
    await createComponent('test-id-1', mockBoard);
    expect(mockStorage.getById).toHaveBeenCalledWith('test-id-1');
    expect(component.board()).toEqual(mockBoard);
  });

  it('should redirect to library if board not found', async () => {
    await createComponent('non-existent', undefined);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/library']);
  });

  it('should redirect to library if no id provided', async () => {
    await createComponent(null, undefined);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/library']);
  });

  it('should display board name', async () => {
    await createComponent('test-id-1', mockBoard);
    const title = fixture.nativeElement.querySelector('h2');
    expect(title.textContent).toContain('Summer Vibes');
  });

  it('should display original prompt', async () => {
    await createComponent('test-id-1', mockBoard);
    const promptText = fixture.nativeElement.querySelector('.italic');
    expect(promptText.textContent).toContain('bohemian summer style');
  });

  it('should display back to library link', async () => {
    await createComponent('test-id-1', mockBoard);
    const backLink = fixture.nativeElement.querySelector('a[routerLink="/library"]');
    expect(backLink).toBeTruthy();
    expect(backLink.textContent).toContain('Back to Library');
  });

  it('should show Add to Favorites button when not favorite', async () => {
    await createComponent('test-id-1', mockBoard);
    const favButton = fixture.nativeElement.querySelector('.glass-btn-secondary');
    expect(favButton.textContent).toContain('Add to Favorites');
  });

  it('should show Remove from Favorites button when favorite', async () => {
    await createComponent('test-id-1', { ...mockBoard, isFavorite: true });
    const favButton = fixture.nativeElement.querySelector('.glass-btn-secondary');
    expect(favButton.textContent).toContain('Remove from Favorites');
  });

  it('should toggle favorite when button is clicked', async () => {
    const updatedBoard = { ...mockBoard, isFavorite: true };
    mockStorage.getById.and.returnValues(mockBoard, updatedBoard);

    await createComponent('test-id-1', mockBoard);
    component.onToggleFavorite();

    expect(mockStorage.toggleFavorite).toHaveBeenCalledWith('test-id-1');
    expect(component.board()?.isFavorite).toBe(true);
  });

  it('should render mood board component', async () => {
    await createComponent('test-id-1', mockBoard);
    const moodBoardComponent = fixture.nativeElement.querySelector('app-mood-board');
    expect(moodBoardComponent).toBeTruthy();
  });

  it('should format date correctly', async () => {
    await createComponent('test-id-1', mockBoard);
    const formatted = component.formatDate('2024-06-15T10:30:00.000Z');
    expect(formatted).toBeTruthy();
  });
});
