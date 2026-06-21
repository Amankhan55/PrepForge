import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/admin.component').then(m => m.AdminComponent),
  },
];
