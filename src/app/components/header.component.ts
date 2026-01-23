import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { LanguageSwitcherComponent } from './language-switcher.component';

@Component({
  selector: 'app-header',
  imports: [TranslocoPipe, LanguageSwitcherComponent],
  template: `
    <header class="border-b-2 border-editorial-black py-8 md:py-12 relative">
      <div class="container mx-auto px-6">
        <!-- Language switcher: above title on mobile, top-right on desktop -->
        <div class="flex justify-end mb-4 md:mb-0 md:absolute md:right-6 md:top-8">
          <app-language-switcher />
        </div>

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
