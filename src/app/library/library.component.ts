import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { HeaderComponent } from '../components/header.component';
import { BoardCardComponent } from '../components/board-card.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog.component';
import { MoodBoardStorageService } from '../services/mood-board-storage.service';
import { SavedMoodBoard } from '../models/mood-board.model';

type FilterMode = 'all' | 'favorites';

@Component({
  selector: 'app-library',
  imports: [TranslocoPipe, RouterLink, HeaderComponent, BoardCardComponent, ConfirmDialogComponent],
  templateUrl: './library.component.html',
})
export class LibraryComponent {
  private storage = inject(MoodBoardStorageService);
  private router = inject(Router);
  private transloco = inject(TranslocoService);

  filterMode = signal<FilterMode>('all');
  boardToDelete = signal<SavedMoodBoard | null>(null);

  displayedBoards = computed(() => {
    const mode = this.filterMode();
    return mode === 'favorites' ? this.storage.favoriteBoards() : this.storage.allBoards();
  });

  isEmpty = computed(() => this.storage.boardCount() === 0);

  setFilter(mode: FilterMode): void {
    this.filterMode.set(mode);
  }

  onViewBoard(board: SavedMoodBoard): void {
    this.router.navigate(['/library', board.id]);
  }

  onToggleFavorite(id: string): void {
    this.storage.toggleFavorite(id);
  }

  onRequestDelete(id: string): void {
    const board = this.storage.getById(id);
    if (board) {
      this.boardToDelete.set(board);
    }
  }

  onConfirmDelete(): void {
    const board = this.boardToDelete();
    if (board) {
      this.storage.delete(board.id);
      this.boardToDelete.set(null);
    }
  }

  onCancelDelete(): void {
    this.boardToDelete.set(null);
  }

  getDeleteTitle(): string {
    return this.transloco.translate('library.deleteDialog.title');
  }

  getDeleteMessage(): string {
    return this.transloco.translate('library.deleteDialog.message', {
      name: this.boardToDelete()?.name,
    });
  }
}
