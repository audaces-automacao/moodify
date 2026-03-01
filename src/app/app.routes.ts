import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () => import('./home.component').then((m) => m.HomeComponent),
    canActivate: [authGuard],
  },
  {
    path: 'library',
    loadComponent: () => import('./library/library.component').then((m) => m.LibraryComponent),
    canActivate: [authGuard],
  },
  {
    path: 'library/:id',
    loadComponent: () => import('./library/view-board.component').then((m) => m.ViewBoardComponent),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
