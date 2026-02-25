import { Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ColorSwatch } from '../models/mood-board.model';

@Component({
  selector: 'app-color-palette',
  imports: [TranslocoPipe],
  template: `
    <section class="mb-12">
      <h3 class="text-uppercase text-luxury-silver mb-6">
        {{ 'colorPalette.title' | transloco }}
      </h3>
      <div class="flex flex-wrap gap-6 justify-center md:justify-start">
        @for (color of colors(); track color.hex) {
          <div class="flex flex-col items-center gap-3 group">
            <div
              class="w-20 h-20 md:w-24 md:h-24 rounded-lg shadow-lg
                     border border-luxury-graphite
                     transition-all duration-300 ease-out
                     group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(201,169,97,0.2)]"
              [style.backgroundColor]="color.hex"
              [title]="color.name + ' - ' + color.usage"
            ></div>
            <div class="text-center">
              <p class="font-serif text-sm font-medium text-luxury-cream">{{ color.name }}</p>
              <p class="font-mono text-xs text-luxury-silver uppercase">{{ color.hex }}</p>
              <p class="text-uppercase text-[10px] text-luxury-champagne mt-1">{{ color.usage }}</p>
            </div>
          </div>
        }
      </div>
    </section>
  `,
})
export class ColorPaletteComponent {
  colors = input.required<ColorSwatch[]>();
}
