import { Component, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-confirm-dialog',
  imports: [TranslocoPipe],
  template: `
    <!-- Backdrop -->
    <button
      type="button"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in cursor-default border-none"
      (click)="dismissed.emit()"
      aria-label="Close dialog"
    ></button>

    <!-- Dialog -->
    <div class="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
      <div
        class="glass-card p-8 rounded-lg w-full max-w-sm animate-fade-in text-center pointer-events-auto"
      >
        <h2 class="font-serif text-xl text-luxury-cream mb-4">
          {{ title() }}
        </h2>
        <p class="text-luxury-silver mb-6">
          {{ message() }}
        </p>

        <div class="flex gap-4">
          <button
            (click)="dismissed.emit()"
            class="glass-btn-secondary flex-1 py-3 rounded-lg text-sm uppercase tracking-widest"
          >
            {{ 'library.confirmDialog.cancel' | transloco }}
          </button>
          <button
            (click)="confirmed.emit()"
            class="flex-1 py-3 rounded-lg bg-luxury-rose text-luxury-cream
                   hover:bg-luxury-rose/80 transition-colors text-sm uppercase tracking-widest"
          >
            {{ 'library.confirmDialog.confirm' | transloco }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmDialogComponent {
  title = input.required<string>();
  message = input.required<string>();

  confirmed = output<void>();
  dismissed = output<void>();
}
