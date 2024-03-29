import { Routes } from '@angular/router';
import { authCanActivate } from './core/services/auth.guard';
import { NotFoundComponent } from './modules/not-found/not-found.component';
import { LoginResolveFn } from './core/services/login.resolve';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/sign-in',
    pathMatch: 'full'
  },
  {
    path: 'content',
    canActivate: [authCanActivate],
    loadChildren: () => import('./modules/content/content.routes').then(m => m.contentRoutes),
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.routes').then(m => m.authRoutes),
    resolve: {
      ready: LoginResolveFn,
    },
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
