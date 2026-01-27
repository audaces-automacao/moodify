import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuthService } from '../auth/auth.service';
import { LanguageSwitcherComponent } from './language-switcher.component';
import { ThemeSwitcherComponent } from './theme-switcher.component';

@Component({
  selector: 'app-header',
  imports: [TranslocoPipe, LanguageSwitcherComponent, ThemeSwitcherComponent],
  template: `
    <header class="border-b border-luxury-graphite py-8 md:py-12 relative">
      <div class="container mx-auto px-6">
        <!-- Settings controls: above title on mobile, top-right on desktop -->
        <div class="flex justify-end gap-3 mb-4 md:mb-0 md:absolute md:right-6 md:top-8 z-10">
          <app-theme-switcher />
          <app-language-switcher />
          @if (authService.isAuthenticated()) {
            <button (click)="logout()" class="glass-btn-secondary px-3 py-1.5 text-xs rounded">
              {{ 'header.logout' | transloco }}
            </button>
          }
        </div>

        <h1
          class="heading-editorial text-5xl md:text-7xl lg:text-8xl text-center text-gradient-gold animate-fade-in"
        >
          {{ 'header.title' | transloco }}
        </h1>
        <p
          class="text-uppercase text-center mt-4 text-luxury-silver tracking-normal md:tracking-[0.3em] text-[0.625rem] md:text-sm animate-fade-in"
        >
          {{ 'header.subtitle' | transloco }}
        </p>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
