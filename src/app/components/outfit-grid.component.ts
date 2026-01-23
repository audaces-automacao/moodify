import { Component, input } from '@angular/core';
import { OutfitSuggestion } from '../models/mood-board.model';

@Component({
  selector: 'app-outfit-grid',
  template: `
    <section class="mb-12">
      <h3 class="text-uppercase text-editorial-charcoal mb-6 tracking-[0.2em]">
        Outfit Suggestions
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Top -->
        <div class="border-2 border-editorial-black p-5 bg-white">
          <span class="text-uppercase text-[10px] text-editorial-gold tracking-widest">Top</span>
          <p class="mt-2 font-serif text-editorial-charcoal leading-relaxed">
            {{ outfit().top }}
          </p>
        </div>

        <!-- Bottom -->
        <div class="border-2 border-editorial-black p-5 bg-white">
          <span class="text-uppercase text-[10px] text-editorial-gold tracking-widest">Bottom</span>
          <p class="mt-2 font-serif text-editorial-charcoal leading-relaxed">
            {{ outfit().bottom }}
          </p>
        </div>

        <!-- Shoes -->
        <div class="border-2 border-editorial-black p-5 bg-white">
          <span class="text-uppercase text-[10px] text-editorial-gold tracking-widest">Shoes</span>
          <p class="mt-2 font-serif text-editorial-charcoal leading-relaxed">
            {{ outfit().shoes }}
          </p>
        </div>

        <!-- Outerwear -->
        @if (outfit().outerwear) {
          <div class="border-2 border-editorial-black p-5 bg-white">
            <span class="text-uppercase text-[10px] text-editorial-gold tracking-widest">
              Outerwear
            </span>
            <p class="mt-2 font-serif text-editorial-charcoal leading-relaxed">
              {{ outfit().outerwear }}
            </p>
          </div>
        }
      </div>

      <!-- Accessories -->
      @if (outfit().accessories.length > 0) {
        <div class="mt-6 border-2 border-editorial-black p-5 bg-white">
          <span class="text-uppercase text-[10px] text-editorial-gold tracking-widest">
            Accessories
          </span>
          <div class="mt-3 flex flex-wrap gap-3">
            @for (accessory of outfit().accessories; track accessory) {
              <span
                class="px-3 py-1 bg-editorial-charcoal/10 text-editorial-charcoal text-sm font-serif"
              >
                {{ accessory }}
              </span>
            }
          </div>
        </div>
      }
    </section>
  `,
})
export class OutfitGridComponent {
  outfit = input.required<OutfitSuggestion>();
}
