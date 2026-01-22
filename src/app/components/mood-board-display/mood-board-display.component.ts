import { Component, Input } from '@angular/core';
import { MoodBoard } from '../../models/mood-board.model';
import { AestheticDescriptionComponent } from '../aesthetic-description/aesthetic-description.component';
import { ColorPaletteComponent } from '../color-palette/color-palette.component';
import { StyleKeywordsComponent } from '../style-keywords/style-keywords.component';
import { OutfitSuggestionsComponent } from '../outfit-suggestions/outfit-suggestions.component';
import { FabricRecommendationsComponent } from '../fabric-recommendations/fabric-recommendations.component';

@Component({
  selector: 'app-mood-board-display',
  standalone: true,
  imports: [
    AestheticDescriptionComponent,
    ColorPaletteComponent,
    StyleKeywordsComponent,
    OutfitSuggestionsComponent,
    FabricRecommendationsComponent
  ],
  template: `
    @if (moodBoard) {
      <div class="space-y-6">
        <app-aesthetic-description
          [title]="moodBoard.aestheticTitle"
          [description]="moodBoard.aestheticDescription"
          [moodWords]="moodBoard.moodWords"
        />

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2">
            <app-color-palette [colors]="moodBoard.colorPalette" />
          </div>
          <div>
            <app-style-keywords [keywords]="moodBoard.styleKeywords" />
          </div>
        </div>

        <app-outfit-suggestions [outfit]="moodBoard.outfit" />

        <app-fabric-recommendations [fabrics]="moodBoard.fabrics" />

        <div class="card-glass p-4 animate-slide-up" style="animation-delay: 0.5s">
          <div class="flex flex-wrap justify-center gap-6 text-sm">
            <div class="flex items-center gap-2">
              <span class="text-neutral-600">Season:</span>
              <span class="text-neutral-300">{{ moodBoard.season }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-neutral-600">Occasion:</span>
              <span class="text-neutral-300">{{ moodBoard.occasion }}</span>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class MoodBoardDisplayComponent {
  @Input() moodBoard: MoodBoard | null = null;
}
