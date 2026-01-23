import { Component, computed, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { OutfitSuggestion } from '../models/mood-board.model';

interface OutfitItem {
  labelKey: string;
  value: string;
}

@Component({
  selector: 'app-outfit-grid',
  imports: [TranslocoPipe],
  template: `
    <section class="mb-12">
      <h3 class="text-uppercase text-luxury-silver mb-6 tracking-[0.2em]">
        {{ 'outfits.title' | transloco }}
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        @for (item of outfitItems(); track item.labelKey) {
          <div class="glass-card-hover p-5 rounded-lg">
            <span
              class="text-uppercase text-[10px] text-luxury-champagne tracking-widest font-semibold"
            >
              {{ item.labelKey | transloco }}
            </span>
            <p class="mt-2 font-serif text-luxury-cream leading-relaxed">
              {{ item.value }}
            </p>
          </div>
        }
      </div>

      @if (outfit().accessories.length > 0) {
        <div class="mt-6 glass-card p-5 rounded-lg">
          <span
            class="text-uppercase text-[10px] text-luxury-champagne tracking-widest font-semibold"
          >
            {{ 'outfits.accessories' | transloco }}
          </span>
          <div class="mt-3 flex flex-wrap gap-3">
            @for (accessory of outfit().accessories; track accessory) {
              <span
                class="px-3 py-1 bg-luxury-onyx text-luxury-silver text-sm font-serif rounded-full"
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

  outfitItems = computed<OutfitItem[]>(() => {
    const o = this.outfit();
    const items: OutfitItem[] = [
      { labelKey: 'outfits.top', value: o.top },
      { labelKey: 'outfits.bottom', value: o.bottom },
      { labelKey: 'outfits.shoes', value: o.shoes },
    ];
    if (o.outerwear) {
      items.push({ labelKey: 'outfits.outerwear', value: o.outerwear });
    }
    return items;
  });
}
