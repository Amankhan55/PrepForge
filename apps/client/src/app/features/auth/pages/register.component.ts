import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">
          <div class="logo-mark-lg">P</div>
          <h1 class="auth-title">Create Account</h1>
          <p class="auth-subtitle">Start your interview prep journey today</p>
        </div>

        <form class="auth-form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input id="register-name" type="text" class="glass-input" placeholder="John Doe" [(ngModel)]="name" name="name" required />
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input id="register-email" type="email" class="glass-input" placeholder="you@example.com" [(ngModel)]="email" name="email" required />
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input id="register-password" type="password" class="glass-input" placeholder="Min. 8 characters" [(ngModel)]="password" name="password" required minlength="8" />
          </div>

          @if (error()) {
            <div class="form-error">{{ error() }}</div>
          }

          <button id="btn-register" type="submit" class="btn-premium" [disabled]="loading()">
            @if (loading()) { <span>Creating account...</span> } @else { <span>Get Started →</span> }
          </button>
        </form>

        <p class="auth-footer">
          Already have an account?
          <a routerLink="/auth/login" class="auth-link" id="link-login">Sign in</a>
        </p>
      </div>

      <div class="auth-visual">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-num glow-text-accent">200+</div>
            <div class="stat-label">Questions</div>
          </div>
          <div class="stat-card">
            <div class="stat-num text-pink-500" style="text-shadow: 0 0 12px rgba(244, 63, 94, 0.4)">3</div>
            <div class="stat-label">Categories</div>
          </div>
          <div class="stat-card">
            <div class="stat-num text-cyan-400" style="text-shadow: 0 0 12px rgba(34, 211, 238, 0.4)">∞</div>
            <div class="stat-label">Mock Tests</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">📊</div>
            <div class="stat-label">Analytics</div>
          </div>
        </div>
        <div class="visual-headline">
          <h2>Everything you need to<br/><span class="gradient-text">land your dream job</span></h2>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { display:flex; min-height:100vh; background:var(--color-bg); position: relative; }
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
    .auth-logo { text-align:center; margin-bottom:36px; }
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
    .auth-subtitle { color:var(--color-text-muted);font-size:0.9rem; }
    .auth-form { display:flex;flex-direction:column;gap:20px; }
    .form-group { display:flex;flex-direction:column;gap:8px; }
    .form-label { font-size:0.75rem;font-weight:700;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:0.05em; }
    .form-error {
      background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25);
      border-radius: 8px; padding: 10px 14px; color: var(--color-danger); font-size: 0.85rem;
      text-shadow: 0 0 10px rgba(239,68,68,0.1);
    }
    .auth-footer { text-align:center;color:var(--color-text-muted);font-size:0.875rem;margin-top:28px; }
    .auth-link { color: var(--color-accent-light); font-weight: 600; text-decoration: none; transition: color 0.15s; }
    .auth-link:hover { color: white; text-shadow: 0 0 8px rgba(167, 139, 250, 0.6); }

    /* Visual panel */
    .auth-visual {
      flex: 1; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 40px;
      background: radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 60%);
      z-index: 5;
    }
    .stats-grid { display:grid;grid-template-columns:1fr 1fr;gap:16px; z-index: 10; }
    .stat-card {
      background: rgba(10, 10, 16, 0.4); border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 16px; padding: 24px; text-align: center; width: 140px;
      backdrop-filter: blur(8px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      transition: all 0.3s;
    }
    .stat-card:hover {
      border-color: rgba(255, 255, 255, 0.08);
      transform: translateY(-4px);
    }
    .stat-num { font-size:2rem;font-weight:800;color:var(--color-accent-light);margin-bottom:4px; }
    .stat-label { font-size:0.8rem;color:var(--color-text-muted);font-weight:500; }
    .visual-headline { text-align:center; z-index: 10; }
    .visual-headline h2 { font-size: 2.25rem; font-weight: 900; color: var(--color-text); line-height: 1.35; letter-spacing: -0.02em; }
    .gradient-text { background: linear-gradient(135deg, var(--color-accent-light), #FF3E6C); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    @media (max-width:900px) { .auth-visual { display:none; } .auth-card { width:100%;border-right:none; } }
  `],
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.name || !this.email || !this.password) return;
    this.loading.set(true);
    this.error.set('');

    this.authService.register(this.name, this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Registration failed. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
