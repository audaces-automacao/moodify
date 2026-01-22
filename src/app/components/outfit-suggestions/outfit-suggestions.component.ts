import { Component, Input } from '@angular/core';
import { OutfitSuggestion } from '../../models/mood-board.model';

@Component({
  selector: 'app-outfit-suggestions',
  standalone: true,
  template: `
    <div class="card-glass p-6 animate-slide-up" style="animation-delay: 0.3s">
      <h3 class="section-title">Outfit Suggestions</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Top -->
        <div class="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800/50">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-2xl">👔</span>
            <span class="text-xs uppercase tracking-wider text-neutral-500">Top</span>
          </div>
          <h4 class="text-neutral-100 font-medium mb-1">{{ outfit.top.item }}</h4>
          <p class="text-neutral-400 text-sm mb-2">{{ outfit.top.details }}</p>
          <p class="text-neutral-500 text-xs italic">{{ outfit.top.styling }}</p>
        </div>

        <!-- Bottom -->
        <div class="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800/50">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-2xl">👖</span>
            <span class="text-xs uppercase tracking-wider text-neutral-500">Bottom</span>
          </div>
          <h4 class="text-neutral-100 font-medium mb-1">{{ outfit.bottom.item }}</h4>
          <p class="text-neutral-400 text-sm mb-2">{{ outfit.bottom.details }}</p>
          <p class="text-neutral-500 text-xs italic">{{ outfit.bottom.styling }}</p>
        </div>

        <!-- Shoes -->
        <div class="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800/50">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-2xl">👟</span>
            <span class="text-xs uppercase tracking-wider text-neutral-500">Shoes</span>
          </div>
          <h4 class="text-neutral-100 font-medium mb-1">{{ outfit.shoes.item }}</h4>
          <p class="text-neutral-400 text-sm mb-2">{{ outfit.shoes.details }}</p>
          <p class="text-neutral-500 text-xs italic">{{ outfit.shoes.styling }}</p>
        </div>

        <!-- Accessories -->
        <div class="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800/50">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-2xl">💎</span>
            <span class="text-xs uppercase tracking-wider text-neutral-500">Accessories</span>
          </div>
          @for (accessory of outfit.accessories; track accessory.item; let i = $index) {
            <div [class.mt-3]="i > 0" [class.pt-3]="i > 0" [class.border-t]="i > 0" [class.border-neutral-800]="i > 0">
              <h4 class="text-neutral-100 font-medium mb-1">{{ accessory.item }}</h4>
              <p class="text-neutral-400 text-sm">{{ accessory.details }}</p>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class OutfitSuggestionsComponent {
  @Input() outfit!: OutfitSuggestion;
}
