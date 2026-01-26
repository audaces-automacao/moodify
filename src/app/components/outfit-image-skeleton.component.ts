import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-outfit-image-skeleton',
  imports: [TranslocoPipe],
  template: `
    <section class="mt-12 animate-fade-in">
      <div class="skeleton-shimmer h-4 w-40 rounded mb-6"></div>
      <div class="glass-card p-4 rounded-lg">
        <div class="skeleton-shimmer w-full max-w-lg mx-auto aspect-square rounded-lg"></div>
        <p class="text-xs text-luxury-silver/60 text-center mt-4">
          {{ 'outfitImage.generating' | transloco }}
        </p>
      </div>
    </section>
  `,
})
export class OutfitImageSkeletonComponent {}
