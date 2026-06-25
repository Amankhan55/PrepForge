import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  let url = req.url;
  // If running on production (Vercel), automatically rewrite localhost API requests to the live Render URL
  if (!window.location.hostname.includes('localhost') && url.startsWith('http://localhost:3000')) {
    url = url.replace('http://localhost:3000', 'https://prepforge-api-9th2.onrender.com');
  }

  // Set withCredentials for all requests to ensure cookies are sent with cross-origin requests
  const authReq = req.clone({
    url,
    withCredentials: true,
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // If we encounter a 401 Unauthorized error on any request that is NOT the login, register, or refresh endpoint
      if (
        error.status === 401 &&
        !req.url.includes('/auth/login') &&
        !req.url.includes('/auth/register') &&
        !req.url.includes('/auth/refresh')
      ) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Retry the original request with credentials and correct URL
            return next(authReq);
          }),
          catchError((refreshError) => {
            // If the refresh token is expired/invalid, clear session and redirect to login
            authService.logoutSilently();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
