import { Routes } from '@angular/router';
import { authGuard, guestGuard, adminGuard } from './core/guards/auth.guard';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'questions',
    canActivate: [authGuard],
    loadChildren: () => import('./features/questions/questions.routes').then((m) => m.questionsRoutes),
  },
  {
    path: 'notes',
    canActivate: [authGuard],
    loadChildren: () => import('./features/notes/notes.routes').then((m) => m.notesRoutes),
  },
  {
    path: 'mock-tests',
    canActivate: [authGuard],
    loadChildren: () => import('./features/mock-tests/mock-tests.routes').then((m) => m.mockTestsRoutes),
  },
  {
    path: 'analytics',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/analytics/pages/analytics.component').then((m) => m.AnalyticsComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.adminRoutes),
  },
  { path: '**', redirectTo: '/dashboard' },
];
