import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, TranslocoPipe],
  template: `
    <div class="min-h-screen bg-luxury-void flex items-center justify-center px-6">
      <div class="glass-card p-8 rounded-lg w-full max-w-md">
        <h1 class="font-serif text-3xl text-gradient-gold text-center mb-8">
          {{ 'header.title' | transloco }}
        </h1>

        <form (ngSubmit)="onSubmit()">
          <div class="mb-6">
            <label for="email" class="text-uppercase block mb-2 text-luxury-silver">
              {{ 'login.email' | transloco }}
            </label>
            <input
              id="email"
              type="email"
              [(ngModel)]="email"
              name="email"
              class="glass-input w-full p-4 rounded-lg text-luxury-cream"
              [placeholder]="'login.emailPlaceholder' | transloco"
              required
            />
          </div>

          <div class="mb-6">
            <label for="password" class="text-uppercase block mb-2 text-luxury-silver">
              {{ 'login.password' | transloco }}
            </label>
            <input
              id="password"
              type="password"
              [(ngModel)]="password"
              name="password"
              class="glass-input w-full p-4 rounded-lg text-luxury-cream"
              [placeholder]="'login.passwordPlaceholder' | transloco"
              required
            />
          </div>

          @if (error()) {
            <div class="mb-6 p-4 bg-luxury-rose/20 border border-luxury-rose rounded-lg">
              <p class="text-luxury-rose text-sm text-center">
                {{ 'login.invalidCredentials' | transloco }}
              </p>
            </div>
          }

          <button
            type="submit"
            [disabled]="isLoading()"
            class="glass-btn-primary w-full py-4 font-sans text-sm font-semibold
                   tracking-widest uppercase rounded-lg"
          >
            {{ isLoading() ? ('login.loggingIn' | transloco) : ('login.submit' | transloco) }}
          </button>
        </form>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  isLoading = signal(false);
  error = signal(false);

  onSubmit(): void {
    if (!this.email || !this.password) return;

    this.isLoading.set(true);
    this.error.set(false);

    this.authService.login(this.email, this.password).subscribe({
      next: (success) => {
        this.isLoading.set(false);
        if (success) {
          this.router.navigate(['/']);
        } else {
          this.error.set(true);
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.error.set(true);
      },
    });
  }
}
