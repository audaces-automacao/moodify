import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { LibraryComponent } from './library.component';
import { MoodBoardStorageService } from '../services/mood-board-storage.service';
import { SavedMoodBoard } from '../models/mood-board.model';
import { signal } from '@angular/core';

describe('LibraryComponent', () => {
  let component: LibraryComponent;
  let fixture: ComponentFixture<LibraryComponent>;
  let mockStorage: jasmine.SpyObj<MoodBoardStorageService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockBoard: SavedMoodBoard = {
    id: 'test-id-1',
    name: 'Test Board',
    prompt: 'test style',
    moodBoard: {
      colorPalette: [{ name: 'Black', hex: '#000000', usage: 'primary' }],
      fabrics: [{ name: 'Cotton', description: 'Soft', texture: 'Smooth', season: 'Summer' }],
      styleKeywords: ['minimal'],
      outfitSuggestions: {
        top: 'Shirt',
        bottom: 'Pants',
        shoes: 'Loafers',
        accessories: [],
      },
      aestheticDescription: 'A minimal look',
    },
    outfitImageUrl: null,
    isFavorite: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  const translations = {
    header: { title: 'MOODIFY', subtitle: 'AI Fashion', logout: 'Logout', library: 'Library' },
    library: {
      title: 'My Mood Boards',
      subtitle: '{{ count }} saved boards',
      filters: { all: 'All', favorites: 'Favorites' },
      empty: {
        title: 'No saved mood boards yet',
        hint: 'Generate and save your first mood board',
        createButton: 'Create Mood Board',
      },
      noFavorites: 'No favorites yet',
      card: { favorite: 'Add to favorites', unfavorite: 'Remove from favorites', delete: 'Delete' },
      deleteDialog: { title: 'Delete Board?', message: 'Delete "{{ name }}"?' },
      confirmDialog: { cancel: 'Cancel', confirm: 'Delete' },
    },
    app: { footer: 'Footer' },
  };

  function setupMockStorage(boards: SavedMoodBoard[]) {
    const allBoardsSignal = signal(boards);
    const favoriteBoardsSignal = signal(boards.filter((b) => b.isFavorite));
    const boardCountSignal = signal(boards.length);

    mockStorage = jasmine.createSpyObj(
      'MoodBoardStorageService',
      ['getById', 'toggleFavorite', 'delete'],
      {
        allBoards: allBoardsSignal,
        favoriteBoards: favoriteBoardsSignal,
        boardCount: boardCountSignal,
      },
    );
    mockStorage.getById.and.callFake((id: string) => boards.find((b) => b.id === id));
  }

  async function createComponent(boards: SavedMoodBoard[] = []) {
    // Mock localStorage for LanguageSwitcherComponent
    spyOn(localStorage, 'getItem').and.returnValue('en');
    spyOn(localStorage, 'setItem');

    setupMockStorage(boards);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LibraryComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: translations },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
      providers: [
        provideRouter([]),
        { provide: MoodBoardStorageService, useValue: mockStorage },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', async () => {
    await createComponent();
    expect(component).toBeTruthy();
  });

  it('should show empty state when no boards exist', async () => {
    await createComponent([]);
    const emptyTitle = fixture.nativeElement.querySelector('.border-dashed p.italic');
    expect(emptyTitle.textContent).toContain('No saved mood boards yet');
  });

  it('should show create button in empty state', async () => {
    await createComponent([]);
    const createButton = fixture.nativeElement.querySelector('a[routerLink="/"]');
    expect(createButton.textContent).toContain('Create Mood Board');
  });

  it('should display board cards when boards exist', async () => {
    await createComponent([mockBoard]);
    const boardCards = fixture.nativeElement.querySelectorAll('app-board-card');
    expect(boardCards.length).toBe(1);
  });

  it('should display filter tabs', async () => {
    await createComponent([mockBoard]);
    const tabs = fixture.nativeElement.querySelectorAll('.flex.gap-2 button');
    expect(tabs.length).toBe(2);
    expect(tabs[0].textContent).toContain('All');
    expect(tabs[1].textContent).toContain('Favorites');
  });

  it('should set filter mode when tab is clicked', async () => {
    await createComponent([mockBoard]);
    expect(component.filterMode()).toBe('all');

    component.setFilter('favorites');
    expect(component.filterMode()).toBe('favorites');
  });

  it('should navigate to board detail when view is triggered', async () => {
    await createComponent([mockBoard]);
    component.onViewBoard(mockBoard);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/library', 'test-id-1']);
  });

  it('should call toggleFavorite when favorite is triggered', async () => {
    await createComponent([mockBoard]);
    component.onToggleFavorite('test-id-1');
    expect(mockStorage.toggleFavorite).toHaveBeenCalledWith('test-id-1');
  });

  it('should show confirm dialog when delete is requested', async () => {
    await createComponent([mockBoard]);
    expect(component.boardToDelete()).toBeNull();

    component.onRequestDelete('test-id-1');
    expect(component.boardToDelete()).toEqual(mockBoard);
  });

  it('should delete board and close dialog on confirm', async () => {
    await createComponent([mockBoard]);
    component.boardToDelete.set(mockBoard);

    component.onConfirmDelete();

    expect(mockStorage.delete).toHaveBeenCalledWith('test-id-1');
    expect(component.boardToDelete()).toBeNull();
  });

  it('should close dialog without deleting on cancel', async () => {
    await createComponent([mockBoard]);
    component.boardToDelete.set(mockBoard);

    component.onCancelDelete();

    expect(mockStorage.delete).not.toHaveBeenCalled();
    expect(component.boardToDelete()).toBeNull();
  });

  it('should return correct delete title', async () => {
    await createComponent([mockBoard]);
    const title = component.getDeleteTitle();
    expect(title).toBe('Delete Board?');
  });

  it('should return delete message with board name', async () => {
    await createComponent([mockBoard]);
    component.boardToDelete.set(mockBoard);
    const message = component.getDeleteMessage();
    expect(message).toContain('Test Board');
  });
});
