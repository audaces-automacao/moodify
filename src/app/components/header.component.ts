import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <header class="border-b-2 border-editorial-black py-8 md:py-12">
      <div class="container mx-auto px-6">
        <h1
          class="heading-editorial text-5xl md:text-7xl lg:text-8xl text-editorial-black text-center"
        >
          MOODIFY
        </h1>
        <p class="text-uppercase text-center mt-4 text-editorial-charcoal tracking-[0.3em]">
          AI-Powered Fashion Mood Board Generator
        </p>
      </div>
    </header>
  `,
})
export class HeaderComponent {}
