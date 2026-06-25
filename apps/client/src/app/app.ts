import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'PrepForge';
  sidebarCollapsed = signal(false);

  navItems = [
    { label: 'Dashboard', icon: '⊞', route: '/dashboard', id: 'nav-dashboard' },
    { label: 'Angular Qs', icon: '▲', route: '/questions/angular', id: 'nav-angular' },
    { label: 'JavaScript Qs', icon: '⬡', route: '/questions/javascript', id: 'nav-javascript' },
    { label: 'System Design', icon: '◈', route: '/questions/system-design', id: 'nav-system-design' },
    { label: 'Mock Tests', icon: '⏱', route: '/mock-tests', id: 'nav-mock-tests' },
    { label: 'Notes', icon: '✎', route: '/notes', id: 'nav-notes' },
    { label: 'Analytics', icon: '◎', route: '/analytics', id: 'nav-analytics' },
    { label: 'Admin Panel', icon: '⚙', route: '/admin', id: 'nav-admin', adminOnly: true },
  ];

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  toggleSidebar() {
    this.sidebarCollapsed.update((v) => !v);
  }

  logout() {
    this.authService.logout();
  }

  isAuthPage(): boolean {
    return this.router.url.startsWith('/auth');
  }
}
