import { Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { interval } from 'rxjs';

@Component({
  selector: 'app-loading-skeleton',
  template: `
    <div class="animate-fade-in">
      <!-- Rotating Message -->
      <div class="text-center mb-10">
        <p
          class="font-serif text-2xl md:text-3xl text-luxury-champagne italic animate-message-fade"
          [class.animate-message-fade]="shouldAnimate()"
          aria-live="polite"
          aria-atomic="true"
        >
          {{ currentMessage() }}
        </p>
      </div>

      <!-- Aesthetic Description Skeleton -->
      <div class="mb-12">
        <div class="skeleton-shimmer h-4 w-32 rounded mb-4"></div>
        <div class="border-l-4 border-luxury-champagne/30 pl-6 py-2">
          <div class="space-y-3">
            <div class="skeleton-shimmer h-5 w-full rounded"></div>
            <div class="skeleton-shimmer h-5 w-5/6 rounded"></div>
            <div class="skeleton-shimmer h-5 w-4/6 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Color Palette Skeleton -->
      <div class="mb-12">
        <div class="skeleton-shimmer h-4 w-32 rounded mb-6"></div>
        <div class="flex flex-wrap gap-4">
          @for (i of [1, 2, 3, 4, 5, 6]; track i) {
            <div class="flex flex-col items-center gap-2">
              <div class="skeleton-shimmer w-16 h-16 md:w-20 md:h-20 rounded-lg"></div>
              <div class="skeleton-shimmer h-3 w-16 rounded"></div>
            </div>
          }
        </div>
      </div>

      <!-- Style Tags Skeleton -->
      <div class="mb-12">
        <div class="skeleton-shimmer h-4 w-32 rounded mb-6"></div>
        <div class="flex flex-wrap gap-3">
          @for (i of [1, 2, 3, 4, 5, 6, 7]; track i) {
            <div class="skeleton-shimmer h-9 rounded-full" [style.width.px]="60 + i * 15"></div>
          }
        </div>
      </div>

      <!-- Fabrics Skeleton -->
      <div class="mb-12">
        <div class="skeleton-shimmer h-4 w-32 rounded mb-6"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          @for (i of [1, 2, 3, 4]; track i) {
            <div class="glass-card p-6 rounded-lg">
              <div class="skeleton-shimmer h-5 w-24 rounded mb-3"></div>
              <div class="space-y-2">
                <div class="skeleton-shimmer h-3 w-full rounded"></div>
                <div class="skeleton-shimmer h-3 w-4/5 rounded"></div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Outfit Skeleton -->
      <div>
        <div class="skeleton-shimmer h-4 w-32 rounded mb-6"></div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          @for (i of [1, 2, 3, 4]; track i) {
            <div class="glass-card p-4 rounded-lg">
              <div class="skeleton-shimmer h-3 w-12 rounded mb-3"></div>
              <div class="space-y-2">
                <div class="skeleton-shimmer h-3 w-full rounded"></div>
                <div class="skeleton-shimmer h-3 w-3/4 rounded"></div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class LoadingSkeletonComponent implements OnInit {
  private transloco = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);

  stage = input<'moodBoard' | 'image'>('moodBoard');

  currentMessage = signal('');
  shouldAnimate = signal(false);

  private currentIndex = 0;

  private messages = computed(() => {
    const key = this.stage() === 'moodBoard' ? 'loading.moodBoard' : 'loading.image';
    return this.transloco.translate<string[]>(key) || [];
  });

  ngOnInit() {
    this.setInitialMessage();

    // Rotate messages every 3.5 seconds
    interval(3500)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.rotateMessage());

    // Update messages when language changes
    this.transloco
      .selectTranslation()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.currentIndex = 0;
        this.setInitialMessage();
      });
  }

  private setInitialMessage() {
    const messages = this.messages();
    if (messages.length > 0) {
      this.currentMessage.set(messages[0]);
    }
  }

  private rotateMessage() {
    const messages = this.messages();
    if (messages.length === 0) return;

    // Trigger fade animation
    this.shouldAnimate.set(true);

    // Change message at the middle of the animation (when opacity is 0)
    setTimeout(() => {
      this.currentIndex = (this.currentIndex + 1) % messages.length;
      this.currentMessage.set(messages[this.currentIndex]);
    }, 300);

    // Reset animation flag
    setTimeout(() => {
      this.shouldAnimate.set(false);
    }, 600);
  }
}
