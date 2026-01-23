import { Component, input } from '@angular/core';
import { FabricRecommendation } from '../models/mood-board.model';

@Component({
  selector: 'app-fabric-list',
  template: `
    <section class="mb-12">
      <h3 class="text-uppercase text-editorial-charcoal mb-6 tracking-[0.2em]">
        Fabric Recommendations
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @for (fabric of fabrics(); track fabric.name) {
          <div
            class="border-2 border-editorial-black p-6 bg-white
                   transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <div class="flex items-start justify-between mb-3">
              <h4 class="font-serif text-xl font-semibold text-editorial-black">
                {{ fabric.name }}
              </h4>
              <span
                class="text-uppercase text-[10px] px-2 py-1 bg-editorial-charcoal text-editorial-white"
              >
                {{ fabric.season }}
              </span>
            </div>
            <p class="text-editorial-charcoal text-sm leading-relaxed mb-3">
              {{ fabric.description }}
            </p>
            <p class="text-editorial-charcoal/70 text-xs italic">
              <span class="font-medium not-italic">Texture:</span> {{ fabric.texture }}
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
