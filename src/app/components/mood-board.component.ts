import { Component, input } from '@angular/core';
import { MoodBoardResponse } from '../models/mood-board.model';
import { ColorPaletteComponent } from './color-palette.component';
import { FabricListComponent } from './fabric-list.component';
import { StyleTagsComponent } from './style-tags.component';
import { OutfitGridComponent } from './outfit-grid.component';

@Component({
  selector: 'app-mood-board',
  imports: [ColorPaletteComponent, FabricListComponent, StyleTagsComponent, OutfitGridComponent],
  template: `
    <div class="animate-fade-in">
      <!-- Aesthetic Description -->
      <section class="mb-12">
        <h3 class="text-uppercase text-editorial-charcoal mb-4 tracking-[0.2em]">
          Aesthetic Overview
        </h3>
        <div class="border-l-4 border-editorial-gold pl-6 py-2">
          <p class="font-serif text-xl md:text-2xl text-editorial-charcoal leading-relaxed italic">
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
    </div>
  `,
})
export class MoodBoardComponent {
  data = input.required<MoodBoardResponse>();
}
