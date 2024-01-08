import { Routes } from '@angular/router';
import { authCanActivate } from "./core/services/auth.guard";
import { NotFoundComponent } from './modules/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./modules/public/public.component').then(
        m => m.PublicComponent
      ),
  },
  {
    path: 'content',
    canActivate: [authCanActivate],
    loadChildren: () =>
      import('./modules/content/content.routes').then(
        m => m.contentRoutes
      ),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.routes').then(m => m.authRoutes),
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
