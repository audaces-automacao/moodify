import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If already verified in this session, allow immediately
  if (authService.isAuthenticated()) {
    return true;
  }

  // Otherwise, verify token with backend
  // Return UrlTree to redirect to login on failure
  return authService
    .verifyToken()
    .pipe(map((isValid) => isValid || router.createUrlTree(['/login'])));
};
