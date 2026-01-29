import { Component, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { SavedMoodBoard } from '../models/mood-board.model';

@Component({
  selector: 'app-board-card',
  imports: [TranslocoPipe],
  template: `
    <article
      class="glass-card-hover rounded-lg overflow-hidden cursor-pointer group"
      role="button"
      tabindex="0"
      (click)="view.emit(board())"
      (keydown.enter)="view.emit(board())"
      (keydown.space)="view.emit(board())"
    >
      <!-- Color Strip Preview -->
      <div class="flex h-3">
        @for (color of board().moodBoard.colorPalette.slice(0, 5); track color.hex) {
          <div class="flex-1" [style.backgroundColor]="color.hex"></div>
        }
      </div>

      <!-- Card Content -->
      <div class="p-6">
        <div class="flex items-start justify-between mb-3">
          <h3 class="font-serif text-xl font-semibold text-luxury-cream line-clamp-1 flex-1 mr-2">
            {{ board().name }}
          </h3>
          <button
            (click)="onFavoriteClick($event)"
            class="text-luxury-champagne hover:scale-110 transition-transform flex-shrink-0"
            [attr.aria-label]="
              board().isFavorite
                ? ('library.card.unfavorite' | transloco)
                : ('library.card.favorite' | transloco)
            "
          >
            @if (board().isFavorite) {
              <!-- Filled heart -->
              <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            } @else {
              <!-- Outline heart -->
              <svg
                class="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            }
          </button>
        </div>

        <!-- Style Tags Preview -->
        <div class="flex flex-wrap gap-2 mb-4">
          @for (tag of board().moodBoard.styleKeywords.slice(0, 3); track tag) {
            <span class="text-xs px-2 py-1 bg-luxury-onyx text-luxury-silver rounded">
              {{ tag }}
            </span>
          }
          @if (board().moodBoard.styleKeywords.length > 3) {
            <span class="text-xs px-2 py-1 text-luxury-silver">
              +{{ board().moodBoard.styleKeywords.length - 3 }}
            </span>
          }
        </div>

        <!-- Aesthetic Description Preview -->
        <p class="text-sm text-luxury-silver line-clamp-2 italic">
          {{ board().moodBoard.aestheticDescription }}
        </p>

        <!-- Footer -->
        <div class="flex items-center justify-between mt-4 pt-4 border-t border-luxury-graphite">
          <span class="text-xs text-luxury-silver/70">
            {{ formatDate(board().createdAt) }}
          </span>
          <button
            (click)="onDeleteClick($event)"
            class="text-luxury-rose/70 hover:text-luxury-rose transition-colors text-xs uppercase tracking-wider"
            [attr.aria-label]="'library.card.delete' | transloco"
          >
            {{ 'library.card.delete' | transloco }}
          </button>
        </div>
      </div>
    </article>
  `,
})
export class BoardCardComponent {
  board = input.required<SavedMoodBoard>();

  view = output<SavedMoodBoard>();
  favorite = output<string>();
  delete = output<string>();

  onFavoriteClick(event: Event): void {
    event.stopPropagation();
    this.favorite.emit(this.board().id);
  }

  onDeleteClick(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.board().id);
  }

  formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString();
  }
}
