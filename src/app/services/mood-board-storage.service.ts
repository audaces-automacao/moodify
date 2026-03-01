import { Injectable, signal, computed } from '@angular/core';
import { SavedMoodBoard, MoodBoardResponse } from '../models/mood-board.model';

const STORAGE_KEY = 'moodify_saved_boards';

export interface SaveMoodBoardInput {
  name: string;
  prompt: string;
  moodBoard: MoodBoardResponse;
  outfitImageUrl: string | null;
}

@Injectable({ providedIn: 'root' })
export class MoodBoardStorageService {
  private readonly boards = signal<SavedMoodBoard[]>(this.loadFromStorage());

  readonly allBoards = computed(() =>
    [...this.boards()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  );

  readonly favoriteBoards = computed(() => this.allBoards().filter((b) => b.isFavorite));

  readonly boardCount = computed(() => this.boards().length);

  save(input: SaveMoodBoardInput): SavedMoodBoard {
    const now = new Date().toISOString();
    const newBoard: SavedMoodBoard = {
      id: this.generateId(),
      name: input.name,
      prompt: input.prompt,
      moodBoard: input.moodBoard,
      outfitImageUrl: input.outfitImageUrl,
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    };

    this.boards.update((boards) => [newBoard, ...boards]);
    this.persistToStorage();
    return newBoard;
  }

  getById(id: string): SavedMoodBoard | undefined {
    return this.boards().find((b) => b.id === id);
  }

  update(id: string, updates: Partial<Omit<SavedMoodBoard, 'id' | 'createdAt'>>): boolean {
    const exists = this.boards().some((b) => b.id === id);
    if (!exists) return false;

    this.boards.update((boards) =>
      boards.map((b) =>
        b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b,
      ),
    );
    this.persistToStorage();
    return true;
  }

  delete(id: string): boolean {
    const exists = this.boards().some((b) => b.id === id);
    if (!exists) return false;

    this.boards.update((boards) => boards.filter((b) => b.id !== id));
    this.persistToStorage();
    return true;
  }

  toggleFavorite(id: string): boolean {
    const board = this.getById(id);
    if (!board) return false;

    return this.update(id, { isFavorite: !board.isFavorite });
  }

  private loadFromStorage(): SavedMoodBoard[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private persistToStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.boards()));
  }

  private generateId(): string {
    return crypto.randomUUID();
  }
}
