import { Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-outfit-image',
  imports: [TranslocoPipe],
  template: `
    <section class="mt-12 animate-fade-in">
      <h3 class="text-uppercase text-luxury-silver mb-6 tracking-[0.2em]">
        {{ 'outfitImage.title' | transloco }}
      </h3>
      <div class="glass-card p-4 rounded-lg overflow-hidden">
        <img
          [src]="imageUrl()"
          [alt]="'outfitImage.altText' | transloco"
          class="w-full max-w-lg mx-auto rounded-lg shadow-lg"
          loading="lazy"
        />
        <p class="text-xs text-luxury-silver/60 text-center mt-4 italic">
          {{ 'outfitImage.disclaimer' | transloco }}
        </p>
      </div>
    </section>
  `,
})
export class OutfitImageComponent {
  imageUrl = input.required<string>();
}
