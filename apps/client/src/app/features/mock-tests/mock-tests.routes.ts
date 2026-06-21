import { Routes } from '@angular/router';

export const mockTestsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/mock-tests.component').then((m) => m.MockTestsComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/test-session.component').then((m) => m.TestSessionComponent),
  },
];
