import { AuthGuardService } from './core/services/auth.guard.service';
import { LoginResolveService } from './core/services/login.resolve.service';
import { HomeComponent } from './modules/home/home.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: ()=> import('./modules/public/public.component').then((m)=>m.PublicComponent),
  },
  {
    path: 'login',
    resolve: {
      ready: LoginResolveService
    },
    loadComponent: () =>
      import('./modules/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'home',
    canActivate: [AuthGuardService],
    loadComponent: () =>
      import('./modules/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'wanted',
    canActivate: [AuthGuardService],
    loadComponent: () =>
      import('./modules/wanted/wanted.component').then((m) => m.WantedComponent),
  },
  {
    path: 'settings',
    canActivate: [AuthGuardService],
    loadComponent: () =>
      import('./modules/settings/settings.component').then((m) => m.SettingsComponent),
  },
];
