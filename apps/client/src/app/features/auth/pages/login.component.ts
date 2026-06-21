import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">
          <div class="logo-mark-lg">P</div>
          <h1 class="auth-title">PrepForge</h1>
          <p class="auth-subtitle">Your daily interview prep companion</p>
        </div>

        <form class="auth-form" (ngSubmit)="onSubmit()" #form="ngForm">
          <div class="form-group">
            <label class="form-label" for="email">Email</label>
            <input
              id="login-email"
              type="email"
              class="glass-input"
              placeholder="you@example.com"
              [(ngModel)]="email"
              name="email"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input
              id="login-password"
              type="password"
              class="glass-input"
              placeholder="••••••••"
              [(ngModel)]="password"
              name="password"
              required
            />
          </div>

          @if (error()) {
            <div class="form-error">{{ error() }}</div>
          }

          <button id="btn-login" type="submit" class="btn-premium" [disabled]="loading()">
            @if (loading()) { <span>Signing in...</span> } @else { <span>Sign in →</span> }
          </button>
        </form>

        <p class="auth-footer">
          Don't have an account?
          <a routerLink="/auth/register" class="auth-link" id="link-register">Create one</a>
        </p>
      </div>

      <div class="auth-visual">
        <div class="floating-card" style="top:15%;left:10%">
          <span class="fc-icon" style="color:#FF3E6C">▲</span>
          <span>Angular Questions</span>
        </div>
        <div class="floating-card" style="top:40%;right:8%">
          <span class="fc-icon" style="color:#F7DF1E">⬡</span>
          <span>JS Deep Dives</span>
        </div>
        <div class="floating-card" style="bottom:25%;left:15%">
          <span class="fc-icon" style="color:#06B6D4">◈</span>
          <span>System Design</span>
        </div>
        <div class="floating-card" style="bottom:15%;right:12%">
          <span class="fc-icon" style="color:#10B981">◎</span>
          <span>Progress Tracking</span>
        </div>
        <div class="visual-headline">
          <h2>Ace your<br/><span class="gradient-text">next interview</span></h2>
          <p>Hundreds of curated questions,<br/>mock tests & progress analytics</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      display: flex;
      min-height: 100vh;
      background: var(--color-bg);
      position: relative;
    }
    .auth-card {
      width: 440px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 48px;
      background: rgba(10, 10, 16, 0.65);
      backdrop-filter: blur(30px);
      -webkit-backdrop-filter: blur(30px);
      border-right: 1px solid rgba(255, 255, 255, 0.04);
      box-shadow: 10px 0 40px rgba(0, 0, 0, 0.5);
      z-index: 10;
    }
    .auth-logo { text-align: center; margin-bottom: 40px; }
    .logo-mark-lg {
      width: 58px; height: 58px;
      background: linear-gradient(135deg, var(--color-accent), #FF3E6C);
      border-radius: 14px;
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 1.65rem; font-weight: 900; color: white;
      margin: 0 auto 16px;
      box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
      text-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
    }
    .auth-title { font-size: 2rem; font-weight: 900; color: var(--color-text); margin-bottom: 6px; letter-spacing: -0.02em; }
    .auth-subtitle { color: var(--color-text-muted); font-size: 0.9rem; }
    .auth-form { display: flex; flex-direction: column; gap: 20px; }
    .form-group { display: flex; flex-direction: column; gap: 8px; }
    .form-label { font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .form-error {
      background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25);
      border-radius: 8px; padding: 10px 14px; color: var(--color-danger); font-size: 0.85rem;
      text-shadow: 0 0 10px rgba(239,68,68,0.1);
    }
    .auth-footer { text-align: center; color: var(--color-text-muted); font-size: 0.875rem; margin-top: 28px; }
    .auth-link { color: var(--color-accent-light); font-weight: 600; text-decoration: none; transition: color 0.15s; }
    .auth-link:hover { color: white; text-shadow: 0 0 8px rgba(167, 139, 250, 0.6); }

    /* Visual panel */
    .auth-visual {
      flex: 1; position: relative; display: flex; align-items: center; justify-content: center;
      background: radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 60%);
      z-index: 5;
    }
    .visual-headline { text-align: center; z-index: 1; }
    .visual-headline h2 { font-size: 3.25rem; font-weight: 900; color: var(--color-text); line-height: 1.15; margin-bottom: 16px; letter-spacing: -0.03em; }
    .gradient-text { background: linear-gradient(135deg, var(--color-accent-light), #FF3E6C); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .visual-headline p { color: var(--color-text-muted); font-size: 1.05rem; line-height: 1.6; }
    .floating-card {
      position: absolute; background: rgba(10, 10, 16, 0.5); border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 12px; padding: 10px 18px; display: flex; align-items: center; gap: 8px;
      font-size: 0.875rem; font-weight: 600; color: var(--color-text);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4); backdrop-filter: blur(12px);
      animation: float 5s ease-in-out infinite;
      transition: all 0.3s;
    }
    .floating-card:hover {
      border-color: rgba(255, 255, 255, 0.1);
      transform: scale(1.05);
    }
    .floating-card:nth-child(2) { animation-delay: 1.2s; }
    .floating-card:nth-child(3) { animation-delay: 2.4s; }
    .floating-card:nth-child(4) { animation-delay: 0.6s; }
    .fc-icon { font-size: 1.25rem; text-shadow: 0 0 8px currentColor; }
    @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    @media (max-width: 900px) { .auth-visual { display: none; } .auth-card { width: 100%; border-right: none; } }
  `],
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.email || !this.password) return;
    this.loading.set(true);
    this.error.set('');

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Login failed. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
