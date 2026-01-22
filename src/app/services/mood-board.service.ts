import { Injectable, signal, computed } from '@angular/core';
import { OpenAIService } from './openai.service';
import { MoodBoard, AppState, AppError } from '../models/mood-board.model';

@Injectable({
  providedIn: 'root'
})
export class MoodBoardService {
  private _moodBoard = signal<MoodBoard | null>(null);
  private _state = signal<AppState>('idle');
  private _error = signal<AppError | null>(null);
  private _currentPrompt = signal<string>('');

  readonly moodBoard = computed(() => this._moodBoard());
  readonly state = computed(() => this._state());
  readonly error = computed(() => this._error());
  readonly currentPrompt = computed(() => this._currentPrompt());
  readonly isLoading = computed(() => this._state() === 'loading');
  readonly hasResult = computed(() => this._state() === 'success' && this._moodBoard() !== null);
  readonly hasError = computed(() => this._state() === 'error');

  constructor(private openaiService: OpenAIService) {}

  generateMoodBoard(prompt: string): void {
    if (!prompt.trim()) return;

    this._state.set('loading');
    this._error.set(null);
    this._currentPrompt.set(prompt);

    this.openaiService.generateMoodBoard(prompt).subscribe({
      next: (moodBoard) => {
        this._moodBoard.set(moodBoard);
        this._state.set('success');
      },
      error: (error: AppError) => {
        this._error.set(error);
        this._state.set('error');
      }
    });
  }

  retry(): void {
    const prompt = this._currentPrompt();
    if (prompt) {
      this.generateMoodBoard(prompt);
    }
  }

  reset(): void {
    this._moodBoard.set(null);
    this._state.set('idle');
    this._error.set(null);
    this._currentPrompt.set('');
  }

  dismissError(): void {
    this._error.set(null);
    this._state.set('idle');
  }
}
