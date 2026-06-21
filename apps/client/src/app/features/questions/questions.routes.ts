import { Routes } from '@angular/router';

export const questionsRoutes: Routes = [
  {
    path: ':category',
    loadComponent: () =>
      import('./pages/questions-list.component').then((m) => m.QuestionsListComponent),
  },
  {
    path: ':category/:id',
    loadComponent: () =>
      import('./pages/question-detail.component').then((m) => m.QuestionDetailComponent),
  },
  { path: '', redirectTo: 'angular', pathMatch: 'full' },
];
