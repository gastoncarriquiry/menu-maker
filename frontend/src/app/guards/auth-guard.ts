import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth';

/**
 * Auth guard to protect routes that require authentication
 */
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isAuthd = auth.isUserAuthenticated();

  if (!isAuthd) {
    // Store the attempted URL for redirecting after login
    const returnUrl = state.url;
    router.navigate(['/login'], {
      queryParams: { returnUrl },
    });
  }

  return isAuthd;
};

/**
 * Guest guard to prevent authenticated users from accessing auth pages
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isAuthd = auth.isUserAuthenticated();

  if (isAuthd) router.navigate(['/dashboard']);

  return !isAuthd;
};
