import { Component, input, output, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-mood-board-input',
    imports: [FormsModule],
    template: `
    <div class="w-full">
      <label for="style-input" class="section-title block mb-3">
        Describe Your Style
      </label>
      <textarea
        id="style-input"
        [ngModel]="promptText()"
        (ngModelChange)="promptText.set($any($event))"
        [disabled]="isLoading()"
        placeholder="Describe your style, occasion, or vibe... (e.g., 'Confident business casual for a creative agency - modern, slightly edgy but professional')"
        class="textarea-luxury w-full"
        rows="4"
        (keydown.enter)="onKeyDown($any($event))"
      ></textarea>

      <div class="mt-6 flex justify-center">
        <button
          (click)="onSubmit()"
          [disabled]="!canSubmit()"
          class="btn-luxury flex items-center gap-3"
        >
          @if (isLoading()) {
            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Curating Your Style...</span>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span>Generate Mood Board</span>
          }
        </button>
      </div>
    </div>
  `
})
export class MoodBoardInputComponent {
  isLoading = input(false);
  submitPrompt = output<string>();

  promptText = signal('');

  canSubmit = computed(() => this.promptText().trim().length >= 10 && !this.isLoading());

  onSubmit(): void {
    if (this.canSubmit()) {
      this.submitPrompt.emit(this.promptText().trim());
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      this.onSubmit();
    }
  }

  setPrompt(prompt: string): void {
    this.promptText.set(prompt);
  }
}
