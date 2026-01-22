import { Component, Input } from '@angular/core';
import { ColorItem } from '../../models/mood-board.model';

@Component({
  selector: 'app-color-palette',
  standalone: true,
  template: `
    <div class="card-glass p-6 animate-slide-up" style="animation-delay: 0.1s">
      <h3 class="section-title">Color Palette</h3>
      <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
        @for (color of colors; track color.hex; let i = $index) {
          <div
            class="group cursor-pointer"
            [style.animation-delay]="(i * 0.05) + 's'"
            (click)="copyToClipboard(color.hex)"
          >
            <div
              class="color-swatch mb-2"
              [style.background-color]="color.hex"
              [title]="'Click to copy ' + color.hex"
            ></div>
            <p class="text-xs text-neutral-400 font-mono text-center group-hover:text-gold-400 transition-colors">
              {{ color.hex }}
            </p>
            <p class="text-xs text-neutral-500 text-center mt-1 truncate" [title]="color.name">
              {{ color.name }}
            </p>
          </div>
        }
      </div>
      @if (copiedHex) {
        <p class="text-center text-gold-400 text-sm mt-4 animate-fade-in">
          Copied {{ copiedHex }} to clipboard!
        </p>
      }
    </div>
  `
})
export class ColorPaletteComponent {
  @Input() colors: ColorItem[] = [];

  copiedHex: string | null = null;

  async copyToClipboard(hex: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(hex);
      this.copiedHex = hex;
      setTimeout(() => {
        this.copiedHex = null;
      }, 2000);
    } catch {
      console.error('Failed to copy to clipboard');
    }
  }
}
