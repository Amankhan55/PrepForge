import { Routes } from '@angular/router';

export const notesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/notes.component').then((m) => m.NotesComponent),
  },
];
