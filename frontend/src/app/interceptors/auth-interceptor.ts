import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth';

/**
 * Functional HTTP interceptor that adds authentication token to requests
 * and handles token refresh on 401 errors
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const auth = inject(AuthService);
  const token = auth.getAccessToken();

  // Clone request and add authorization header if token exists
  let authReq = req;
  if (token && !isAuthUrl(req.url)) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized errors
      if (error.status === 401 && !isAuthUrl(req.url)) {
        // Try to refresh token
        return auth.refreshToken().pipe(
          switchMap(() => {
            // Retry the original request with new token
            const newToken = auth.getAccessToken();
            const retryReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${newToken}`),
            });
            return next(retryReq);
          }),
          catchError(() => {
            // Refresh failed, logout user
            auth.logout().subscribe();
            return throwError(() => error);
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};

/**
 * Helper function to check if URL is an auth endpoint
 */
function isAuthUrl(url: string): boolean {
  return (
    url.includes('/auth/login') ||
    url.includes('/auth/register') ||
    url.includes('/auth/refresh')
  );
}

/**
 * Functional HTTP interceptor for handling global errors
 */
export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMessage = `Server Error: ${error.status} - ${error.error?.message ?? error.message}`;
      }

      console.error('HTTP Error:', errorMessage);

      // You can add a toast notification service here
      // Example: inject(ToastService).showError(errorMessage);

      return throwError(() => new Error(errorMessage));
    }),
  );
};
