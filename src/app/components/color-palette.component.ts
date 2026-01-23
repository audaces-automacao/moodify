import { Component, input } from '@angular/core';
import { ColorSwatch } from '../models/mood-board.model';

@Component({
  selector: 'app-color-palette',
  template: `
    <section class="mb-12">
      <h3 class="text-uppercase text-editorial-charcoal mb-6 tracking-[0.2em]">Color Palette</h3>
      <div class="flex flex-wrap gap-6 justify-center md:justify-start">
        @for (color of colors(); track color.hex) {
          <div class="flex flex-col items-center gap-3 group">
            <div
              class="w-20 h-20 md:w-24 md:h-24 border-2 border-editorial-black shadow-lg
                     transition-transform group-hover:scale-105"
              [style.backgroundColor]="color.hex"
              [title]="color.name + ' - ' + color.usage"
            ></div>
            <div class="text-center">
              <p class="font-serif text-sm font-medium text-editorial-charcoal">{{ color.name }}</p>
              <p class="font-mono text-xs text-editorial-charcoal/70 uppercase">{{ color.hex }}</p>
              <p class="text-uppercase text-[10px] text-editorial-gold mt-1">{{ color.usage }}</p>
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
