import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-header',
  imports: [TranslocoPipe],
  template: `
    <header class="border-b-2 border-editorial-black py-8 md:py-12">
      <div class="container mx-auto px-6">
        <h1
          class="heading-editorial text-5xl md:text-7xl lg:text-8xl text-editorial-black text-center"
        >
          {{ 'header.title' | transloco }}
        </h1>
        <p class="text-uppercase text-center mt-4 text-editorial-charcoal tracking-[0.3em]">
          {{ 'header.subtitle' | transloco }}
        </p>
      </div>
    </header>
  `,
})
export class HeaderComponent {}
