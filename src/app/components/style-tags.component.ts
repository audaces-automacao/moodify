import { Component, input } from '@angular/core';

@Component({
  selector: 'app-style-tags',
  template: `
    <section class="mb-12">
      <h3 class="text-uppercase text-editorial-charcoal mb-6 tracking-[0.2em]">Style Keywords</h3>
      <div class="flex flex-wrap gap-3">
        @for (tag of tags(); track tag; let i = $index) {
          <span
            class="px-4 py-2 text-sm font-medium transition-all
                   hover:scale-105 cursor-default"
            [class]="getTagStyle(i)"
          >
            {{ tag }}
          </span>
        }
      </div>
    </section>
  `,
})
export class StyleTagsComponent {
  tags = input.required<string[]>();

  getTagStyle(index: number): string {
    const styles = [
      'bg-editorial-black text-editorial-white',
      'border-2 border-editorial-black text-editorial-black',
      'bg-editorial-gold text-editorial-white',
      'bg-editorial-charcoal text-editorial-white',
      'border-2 border-editorial-gold text-editorial-gold',
      'bg-editorial-red text-editorial-white',
      'border-2 border-editorial-charcoal text-editorial-charcoal',
      'bg-editorial-black/80 text-editorial-white',
    ];
    return styles[index % styles.length];
  }
}
