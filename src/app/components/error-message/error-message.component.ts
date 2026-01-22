import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppError } from '../../models/mood-board.model';

@Component({
  selector: 'app-error-message',
  standalone: true,
  template: `
    <div class="bg-red-950/30 border border-red-900/50 rounded-xl p-8 text-center max-w-lg mx-auto animate-fade-in">
      <div class="text-red-400 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 class="text-neutral-100 text-lg font-medium mb-2">Something went wrong</h3>
      <p class="text-neutral-400 mb-6">{{ error?.userMessage || 'An unexpected error occurred.' }}</p>

      <div class="flex justify-center gap-4">
        @if (error?.retryable) {
          <button
            (click)="retry.emit()"
            class="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-lg transition-colors"
          >
            Try Again
          </button>
        }
        <button
          (click)="dismiss.emit()"
          class="px-6 py-2.5 text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  `
})
export class ErrorMessageComponent {
  @Input() error: AppError | null = null;
  @Output() retry = new EventEmitter<void>();
  @Output() dismiss = new EventEmitter<void>();
}
