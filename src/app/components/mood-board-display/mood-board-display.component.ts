import { Component, input } from '@angular/core';
import { MoodBoard } from '../../models/mood-board.model';
import { AestheticDescriptionComponent } from '../aesthetic-description/aesthetic-description.component';
import { ColorPaletteComponent } from '../color-palette/color-palette.component';
import { StyleKeywordsComponent } from '../style-keywords/style-keywords.component';
import { OutfitSuggestionsComponent } from '../outfit-suggestions/outfit-suggestions.component';
import { FabricRecommendationsComponent } from '../fabric-recommendations/fabric-recommendations.component';

@Component({
    selector: 'app-mood-board-display',
    imports: [
        AestheticDescriptionComponent,
        ColorPaletteComponent,
        StyleKeywordsComponent,
        OutfitSuggestionsComponent,
        FabricRecommendationsComponent
    ],
    template: `
    @if (moodBoard(); as board) {
      <div class="space-y-6">
        <app-aesthetic-description
          [title]="board.aestheticTitle"
          [description]="board.aestheticDescription"
          [moodWords]="board.moodWords"
        />

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2">
            <app-color-palette [colors]="board.colorPalette" />
          </div>
          <div>
            <app-style-keywords [keywords]="board.styleKeywords" />
          </div>
        </div>

        <app-outfit-suggestions [outfit]="board.outfit" />

        <app-fabric-recommendations [fabrics]="board.fabrics" />

        <div class="card-glass p-4 animate-slide-up" style="animation-delay: 0.5s">
          <div class="flex flex-wrap justify-center gap-6 text-sm">
            <div class="flex items-center gap-2">
              <span class="text-neutral-600">Season:</span>
              <span class="text-neutral-300">{{ board.season }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-neutral-600">Occasion:</span>
              <span class="text-neutral-300">{{ board.occasion }}</span>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class MoodBoardDisplayComponent {
  moodBoard = input<MoodBoard | null>(null);
}
