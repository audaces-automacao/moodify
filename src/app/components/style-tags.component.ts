import { Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-style-tags',
  imports: [TranslocoPipe],
  template: `
    <section class="mb-12">
      <h3 class="text-uppercase text-luxury-silver mb-6 tracking-[0.2em]">
        {{ 'styleTags.title' | transloco }}
      </h3>
      <div class="flex flex-wrap gap-3">
        @for (tag of tags(); track tag; let i = $index) {
          <span
            class="px-4 py-2 text-sm font-medium rounded-full transition-all duration-300
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
      'bg-luxury-champagne text-luxury-void',
      'border border-luxury-champagne text-luxury-champagne',
      'bg-luxury-onyx text-luxury-cream',
      'border border-luxury-graphite text-luxury-cream',
      'bg-luxury-champagne/20 text-luxury-champagne',
      'bg-luxury-rose text-luxury-cream',
      'border border-luxury-cream/30 text-luxury-silver',
      'bg-gradient-to-r from-luxury-champagne to-luxury-gold text-luxury-void',
    ];
    return styles[index % styles.length];
  }
}
