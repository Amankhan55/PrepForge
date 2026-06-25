import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthResponse, User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // private apiUrl = 'http://localhost:3000/api/auth';
  private apiUrl = 'https://prepforge-api-9th2.onrender.com/api/auth';

  private _user = signal<User | null>(this.loadUser());
  private isRefreshing = false;
  private refreshSubject = new BehaviorSubject<boolean | null>(null);

  user = this._user.asReadonly();
  isAuthenticated = computed(() => !!this._user());
  isAdmin = computed(() => this._user()?.role === 'admin');

  constructor(private http: HttpClient, private router: Router) {
    // Verify session validity on startup if a cached user profile exists
    if (this._user()) {
      this.checkAuth().subscribe({
        error: () => this.clearSession(),
      });
    }
  }

  register(name: string, email: string, password: string, role?: string) {
    return this.http.post<{ user: User }>(`${this.apiUrl}/register`, { name, email, password, role }, { withCredentials: true }).pipe(
      tap((res) => this.saveSession(res.user)),
    );
  }

  login(email: string, password: string) {
    return this.http.post<{ user: User }>(`${this.apiUrl}/login`, { email, password }, { withCredentials: true }).pipe(
      tap((res) => this.saveSession(res.user)),
    );
  }

  logout() {
    this.http.delete(`${this.apiUrl}/logout`, { withCredentials: true }).subscribe();
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  logoutSilently() {
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  checkAuth(): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/me`, {}, { withCredentials: true }).pipe(
      tap((user) => this.saveSession(user)),
      catchError((err) => {
        this.clearSession();
        return throwError(() => err);
      })
    );
  }

  refreshToken(): Observable<boolean> {
    if (this.isRefreshing) {
      // Return an observable that waits for the active refresh request to emit success or failure
      return this.refreshSubject.asObservable().pipe(
        filter((val) => val !== null),
        take(1),
        switchMap((success) => {
          if (success) {
            return of(true);
          } else {
            return throwError(() => new Error('Concurrent token refresh failed'));
          }
        })
      );
    }

    this.isRefreshing = true;
    this.refreshSubject.next(null);

    return this.http.post<any>(`${this.apiUrl}/refresh`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.isRefreshing = false;
        this.refreshSubject.next(true);
      }),
      catchError((err) => {
        this.isRefreshing = false;
        this.refreshSubject.next(false);
        this.clearSession();
        return throwError(() => err);
      }),
      switchMap(() => of(true))
    );
  }

  private saveSession(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this._user.set(user);
  }

  private clearSession() {
    localStorage.removeItem('user');
    this._user.set(null);
  }

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
