import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthResponse, User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  private _user = signal<User | null>(this.loadUser());
  private _token = signal<string | null>(localStorage.getItem('access_token'));

  user = this._user.asReadonly();
  token = this._token.asReadonly();
  isAuthenticated = computed(() => !!this._user() && !!this._token());

  constructor(private http: HttpClient, private router: Router) {}

  register(name: string, email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { name, email, password }).pipe(
      tap((res) => this.saveSession(res)),
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => this.saveSession(res)),
    );
  }

  logout() {
    this.http.delete(`${this.apiUrl}/logout`).subscribe();
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  private saveSession(res: AuthResponse) {
    localStorage.setItem('access_token', res.accessToken);
    localStorage.setItem('refresh_token', res.refreshToken);
    localStorage.setItem('user', JSON.stringify(res.user));
    this._token.set(res.accessToken);
    this._user.set(res.user);
  }

  private clearSession() {
    localStorage.clear();
    this._token.set(null);
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
