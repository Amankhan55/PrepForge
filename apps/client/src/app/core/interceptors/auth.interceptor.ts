import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Set withCredentials for all requests to ensure cookies are sent with cross-origin requests
  const authReq = req.clone({
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
            // Retry the original request with credentials
            const retryReq = req.clone({
              withCredentials: true,
            });
            return next(retryReq);
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
