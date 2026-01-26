import { Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { MoodBoardResponse } from '../models/mood-board.model';
import { ColorPaletteComponent } from './color-palette.component';
import { FabricListComponent } from './fabric-list.component';
import { OutfitGridComponent } from './outfit-grid.component';
import { OutfitImageComponent } from './outfit-image.component';
import { OutfitImageSkeletonComponent } from './outfit-image-skeleton.component';
import { StyleTagsComponent } from './style-tags.component';

@Component({
  selector: 'app-mood-board',
  imports: [
    TranslocoPipe,
    ColorPaletteComponent,
    FabricListComponent,
    StyleTagsComponent,
    OutfitGridComponent,
    OutfitImageComponent,
    OutfitImageSkeletonComponent,
  ],
  template: `
    <div class="animate-fade-in">
      <!-- Aesthetic Description -->
      <section class="mb-12">
        <h3 class="text-uppercase text-luxury-silver mb-4 tracking-[0.2em]">
          {{ 'moodBoard.aestheticOverview' | transloco }}
        </h3>
        <div class="border-l-4 border-luxury-champagne pl-6 py-2">
          <p class="font-serif text-xl md:text-2xl text-luxury-cream leading-relaxed italic">
            {{ data().aestheticDescription }}
          </p>
        </div>
      </section>

      <!-- Color Palette -->
      <app-color-palette [colors]="data().colorPalette" />

      <!-- Style Tags -->
      <app-style-tags [tags]="data().styleKeywords" />

      <!-- Fabrics -->
      <app-fabric-list [fabrics]="data().fabrics" />

      <!-- Outfit Suggestions -->
      <app-outfit-grid [outfit]="data().outfitSuggestions" />

      <!-- Outfit Image -->
      @if (isImageLoading()) {
        <app-outfit-image-skeleton />
      }

      @if (imageError()) {
        <div
          class="mt-12 glass-card border-luxury-rose bg-luxury-rose/10 p-4 text-center animate-fade-in"
        >
          <p class="text-sm text-luxury-rose">{{ imageError() }}</p>
        </div>
      }

      @if (outfitImage()) {
        <app-outfit-image [imageUrl]="outfitImage()!" />
      }
    </div>
  `,
})
export class MoodBoardComponent {
  data = input.required<MoodBoardResponse>();
  outfitImage = input<string | null>(null);
  isImageLoading = input(false);
  imageError = input<string | null>(null);
}
