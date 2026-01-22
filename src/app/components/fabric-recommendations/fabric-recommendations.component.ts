import { Component, input } from '@angular/core';
import { FabricRecommendation } from '../../models/mood-board.model';

@Component({
  selector: 'app-fabric-recommendations',
  standalone: true,
  template: `
    <div class="card-glass p-6 animate-slide-up" style="animation-delay: 0.4s">
      <h3 class="section-title">Fabric Recommendations</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        @for (fabric of fabrics(); track fabric.name; let i = $index) {
          <div class="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800/50 hover:border-gold-400/30 transition-colors">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-xl">{{ getTextureIcon(fabric.texture) }}</span>
              <span class="text-xs uppercase tracking-wider text-gold-400/80">{{ fabric.texture }}</span>
            </div>
            <h4 class="text-neutral-100 font-medium mb-2">{{ fabric.name }}</h4>
            <p class="text-neutral-400 text-sm mb-3">{{ fabric.description }}</p>
            <p class="text-neutral-500 text-xs">
              <span class="text-neutral-600">Best for:</span> {{ fabric.bestFor }}
            </p>
          </div>
        }
      </div>
    </div>
  `
})
export class FabricRecommendationsComponent {
  fabrics = input<FabricRecommendation[]>([]);

  getTextureIcon(texture: string): string {
    const icons: Record<string, string> = {
      smooth: '✨',
      textured: '🧶',
      soft: '☁️',
      structured: '📐',
      flowing: '🌊',
      crisp: '❄️'
    };
    return icons[texture] || '🧵';
  }
}
