import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  template: `
    <div class="animate-fade-in">
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
export class LoadingSkeletonComponent {}
