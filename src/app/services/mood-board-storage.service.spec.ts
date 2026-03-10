import { TestBed } from '@angular/core/testing';
import { MoodBoardStorageService, SaveMoodBoardInput } from './mood-board-storage.service';
import { SavedMoodBoard, MoodBoardResponse } from '../models/mood-board.model';

describe('MoodBoardStorageService', () => {
  let service: MoodBoardStorageService;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  const mockMoodBoard: MoodBoardResponse = {
    colorPalette: [{ name: 'Black', hex: '#000000', usage: 'primary' }],
    fabrics: [{ name: 'Cotton', description: 'Soft', texture: 'Smooth', season: 'Summer' }],
    styleKeywords: ['minimal', 'elegant'],
    outfitSuggestions: {
      top: 'White shirt',
      bottom: 'Black pants',
      shoes: 'Loafers',
      accessories: ['Watch'],
    },
    aestheticDescription: 'A minimal look',
  };

  const mockSavedBoard: SavedMoodBoard = {
    id: 'test-id-1',
    name: 'Test Board',
    prompt: 'minimal style',
    moodBoard: mockMoodBoard,
    outfitImageUrl: 'https://example.com/image.png',
    isFavorite: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  function createService(storedBoards: SavedMoodBoard[] | null = null): MoodBoardStorageService {
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem']);
    localStorageSpy.getItem.and.returnValue(storedBoards ? JSON.stringify(storedBoards) : null);
    spyOnProperty(window, 'localStorage', 'get').and.returnValue(localStorageSpy);

    spyOn(crypto, 'randomUUID').and.returnValue(
      'a1b2c3d4-e5f6-7890-abcd-ef1234567890' as `${string}-${string}-${string}-${string}-${string}`,
    );

    TestBed.configureTestingModule({
      providers: [MoodBoardStorageService],
    });

    return TestBed.inject(MoodBoardStorageService);
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('initialization', () => {
    it('should be created', () => {
      service = createService();
      expect(service).toBeTruthy();
    });

    it('should load boards from localStorage when available', () => {
      service = createService([mockSavedBoard]);
      expect(service.allBoards().length).toBe(1);
      expect(service.allBoards()[0].name).toBe('Test Board');
    });

    it('should initialize with empty array when localStorage is empty', () => {
      service = createService(null);
      expect(service.allBoards().length).toBe(0);
    });

    it('should handle invalid JSON in localStorage gracefully', () => {
      localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem']);
      localStorageSpy.getItem.and.returnValue('invalid json');
      spyOnProperty(window, 'localStorage', 'get').and.returnValue(localStorageSpy);

      TestBed.configureTestingModule({
        providers: [MoodBoardStorageService],
      });

      service = TestBed.inject(MoodBoardStorageService);
      expect(service.allBoards().length).toBe(0);
    });
  });

  describe('computed signals', () => {
    it('should return all boards sorted by createdAt descending', () => {
      const olderBoard = { ...mockSavedBoard, id: '1', createdAt: '2024-01-01T00:00:00.000Z' };
      const newerBoard = { ...mockSavedBoard, id: '2', createdAt: '2024-01-02T00:00:00.000Z' };
      service = createService([olderBoard, newerBoard]);

      expect(service.allBoards()[0].id).toBe('2');
      expect(service.allBoards()[1].id).toBe('1');
    });

    it('should return only favorite boards in favoriteBoards', () => {
      const favorite = { ...mockSavedBoard, id: '1', isFavorite: true };
      const notFavorite = { ...mockSavedBoard, id: '2', isFavorite: false };
      service = createService([favorite, notFavorite]);

      expect(service.favoriteBoards().length).toBe(1);
      expect(service.favoriteBoards()[0].id).toBe('1');
    });

    it('should return correct board count', () => {
      service = createService([mockSavedBoard, { ...mockSavedBoard, id: '2' }]);
      expect(service.boardCount()).toBe(2);
    });
  });

  describe('save', () => {
    it('should save a new board with generated id', () => {
      service = createService();
      const input: SaveMoodBoardInput = {
        name: 'New Board',
        prompt: 'test prompt',
        moodBoard: mockMoodBoard,
        outfitImageUrl: 'https://example.com/img.png',
      };

      const saved = service.save(input);

      expect(saved.id).toBe('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
      expect(saved.name).toBe('New Board');
      expect(saved.isFavorite).toBe(false);
      expect(service.allBoards().length).toBe(1);
    });

    it('should persist to localStorage after save', () => {
      service = createService();
      const input: SaveMoodBoardInput = {
        name: 'New Board',
        prompt: 'test prompt',
        moodBoard: mockMoodBoard,
        outfitImageUrl: null,
      };

      service.save(input);

      expect(localStorageSpy.setItem).toHaveBeenCalledWith(
        'moodify_saved_boards',
        jasmine.any(String),
      );
    });

    it('should set createdAt and updatedAt timestamps', () => {
      service = createService();
      const input: SaveMoodBoardInput = {
        name: 'New Board',
        prompt: 'test prompt',
        moodBoard: mockMoodBoard,
        outfitImageUrl: null,
      };

      const saved = service.save(input);

      expect(saved.createdAt).toBeTruthy();
      expect(saved.updatedAt).toBeTruthy();
      expect(saved.createdAt).toBe(saved.updatedAt);
    });
  });

  describe('getById', () => {
    it('should return board when found', () => {
      service = createService([mockSavedBoard]);
      const board = service.getById('test-id-1');
      expect(board).toBeTruthy();
      expect(board?.name).toBe('Test Board');
    });

    it('should return undefined when not found', () => {
      service = createService([mockSavedBoard]);
      const board = service.getById('non-existent');
      expect(board).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update board properties', () => {
      service = createService([mockSavedBoard]);
      const result = service.update('test-id-1', { name: 'Updated Name' });

      expect(result).toBe(true);
      expect(service.getById('test-id-1')?.name).toBe('Updated Name');
    });

    it('should update updatedAt timestamp', () => {
      service = createService([mockSavedBoard]);
      service.update('test-id-1', { name: 'Updated Name' });

      const board = service.getById('test-id-1');
      expect(board?.updatedAt).not.toBe(mockSavedBoard.updatedAt);
    });

    it('should return false when board not found', () => {
      service = createService([mockSavedBoard]);
      const result = service.update('non-existent', { name: 'Updated' });
      expect(result).toBe(false);
    });

    it('should persist to localStorage after update', () => {
      service = createService([mockSavedBoard]);
      service.update('test-id-1', { name: 'Updated' });

      expect(localStorageSpy.setItem).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should remove board from list', () => {
      service = createService([mockSavedBoard]);
      const result = service.delete('test-id-1');

      expect(result).toBe(true);
      expect(service.allBoards().length).toBe(0);
    });

    it('should return false when board not found', () => {
      service = createService([mockSavedBoard]);
      const result = service.delete('non-existent');
      expect(result).toBe(false);
    });

    it('should persist to localStorage after delete', () => {
      service = createService([mockSavedBoard]);
      service.delete('test-id-1');

      expect(localStorageSpy.setItem).toHaveBeenCalled();
    });
  });

  describe('toggleFavorite', () => {
    it('should toggle favorite from false to true', () => {
      service = createService([{ ...mockSavedBoard, isFavorite: false }]);
      const result = service.toggleFavorite('test-id-1');

      expect(result).toBe(true);
      expect(service.getById('test-id-1')?.isFavorite).toBe(true);
    });

    it('should toggle favorite from true to false', () => {
      service = createService([{ ...mockSavedBoard, isFavorite: true }]);
      const result = service.toggleFavorite('test-id-1');

      expect(result).toBe(true);
      expect(service.getById('test-id-1')?.isFavorite).toBe(false);
    });

    it('should return false when board not found', () => {
      service = createService([mockSavedBoard]);
      const result = service.toggleFavorite('non-existent');
      expect(result).toBe(false);
    });
  });
});
