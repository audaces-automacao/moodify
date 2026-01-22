import { Component, input } from '@angular/core';

@Component({
  selector: 'app-aesthetic-description',
  standalone: true,
  template: `
    <div class="text-center mb-12 animate-fade-in">
      <h2 class="font-display text-4xl md:text-5xl text-neutral-100 mb-4">
        {{ title() }}
      </h2>
      <p class="text-neutral-400 text-lg max-w-2xl mx-auto leading-relaxed">
        {{ description() }}
      </p>
      @if (moodWords().length > 0) {
        <div class="mt-6 flex justify-center gap-3">
          @for (word of moodWords(); track word) {
            <span class="text-gold-400 text-sm italic">{{ word }}</span>
            @if (!$last) {
              <span class="text-neutral-700">·</span>
            }
          }
        </div>
      }
    </div>
  `
})
export class AestheticDescriptionComponent {
  title = input('');
  description = input('');
  moodWords = input<string[]>([]);
}
