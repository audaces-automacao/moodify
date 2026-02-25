import { Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FabricRecommendation } from '../models/mood-board.model';

@Component({
  selector: 'app-fabric-list',
  imports: [TranslocoPipe],
  template: `
    <section class="mb-12">
      <h3 class="text-uppercase text-luxury-silver mb-6">
        {{ 'fabrics.title' | transloco }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @for (fabric of fabrics(); track fabric.name) {
          <div class="glass-card-hover p-6 rounded-lg">
            <div class="flex items-start justify-between mb-3">
              <h4 class="font-serif text-xl font-semibold text-luxury-white">
                {{ fabric.name }}
              </h4>
              <span
                class="text-uppercase text-[10px] px-2 py-1 bg-luxury-champagne text-luxury-void
                       rounded font-semibold"
              >
                {{ fabric.season }}
              </span>
            </div>
            <p class="text-luxury-silver text-sm leading-relaxed mb-3">
              {{ fabric.description }}
            </p>
            <p class="text-luxury-silver/70 text-xs italic">
              <span class="font-medium not-italic text-luxury-champagne/80">
                {{ 'fabrics.textureLabel' | transloco }}
              </span>
              {{ fabric.texture }}
            </p>
          </div>
        }
      </div>
    </section>
  `,
})
export class FabricListComponent {
  fabrics = input.required<FabricRecommendation[]>();
}
