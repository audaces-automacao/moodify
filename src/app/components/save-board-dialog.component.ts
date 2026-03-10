import { Component, output, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-save-board-dialog',
  imports: [TranslocoPipe],
  template: `
    <!-- Backdrop -->
    <button
      type="button"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in cursor-default border-none"
      (click)="onDismiss()"
      aria-label="Close dialog"
    ></button>

    <!-- Dialog -->
    <div class="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
      <div class="glass-card p-8 rounded-lg w-full max-w-md animate-fade-in pointer-events-auto">
        <h2 class="font-serif text-2xl text-luxury-cream mb-6">
          {{ 'library.saveDialog.title' | transloco }}
        </h2>

        <div class="mb-6">
          <label for="board-name" class="text-uppercase block mb-2 text-luxury-silver text-sm">
            {{ 'library.saveDialog.nameLabel' | transloco }}
          </label>
          <input
            id="board-name"
            type="text"
            [value]="boardName()"
            (input)="onInput($event)"
            class="glass-input w-full p-4 rounded-lg text-luxury-cream font-sans"
            [placeholder]="'library.saveDialog.namePlaceholder' | transloco"
            (keydown.enter)="onSave()"
          />
        </div>

        <div class="flex gap-4">
          <button
            (click)="onDismiss()"
            class="glass-btn-secondary flex-1 py-3 rounded-lg text-sm uppercase tracking-widest"
          >
            {{ 'library.saveDialog.cancel' | transloco }}
          </button>
          <button
            (click)="onSave()"
            [disabled]="!boardName().trim()"
            class="glass-btn-primary flex-1 py-3 rounded-lg text-sm uppercase tracking-widest"
          >
            {{ 'library.saveDialog.save' | transloco }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class SaveBoardDialogComponent {
  saved = output<string>();
  dismissed = output<void>();

  boardName = signal('');

  onInput(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      this.boardName.set(event.target.value);
    }
  }

  onSave(): void {
    const name = this.boardName().trim();
    if (name) {
      this.saved.emit(name);
    }
  }

  onDismiss(): void {
    this.dismissed.emit();
  }
}
