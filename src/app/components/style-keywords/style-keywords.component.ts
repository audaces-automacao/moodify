import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-style-keywords',
  standalone: true,
  template: `
    <div class="card-glass p-6 animate-slide-up" style="animation-delay: 0.2s">
      <h3 class="section-title">Style Keywords</h3>
      <div class="flex flex-wrap gap-2">
        @for (keyword of keywords; track keyword; let i = $index) {
          <span
            class="style-tag"
            [style.animation-delay]="(i * 0.03) + 's'"
          >
            {{ keyword }}
          </span>
        }
      </div>
    </div>
  `
})
export class StyleKeywordsComponent {
  @Input() keywords: string[] = [];
}
