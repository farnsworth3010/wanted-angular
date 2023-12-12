import { AuthGuardService } from './core/services/auth.guard.service';
// import { LoginResolveService } from './core/services/login.resolve.service';
import { HomeComponent } from './modules/home/home.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: ()=> import('./modules/public/public.component').then((m)=>m.PublicComponent),
  },
  {
    path: 'signin',
    resolve: {
      // ready: LoginResolveService
    },
    loadComponent: () =>
      import('./modules/signin/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    resolve: {
      // ready: LoginResolveService
    },
    loadComponent: () =>
      import('./modules/signup/signup.component').then((m) => m.SignupComponent),
  },
  {
    path: 'verify-email-address',
    loadComponent: () =>
      import('./modules/verify-email-address/verify-email-address.component').then((m) => m.VerifyEmailAddressComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./modules/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
  },
  {
    path: 'home',
    canActivate: [AuthGuardService],
    loadComponent: () =>
      import('./modules/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'wanted/:id',
    canActivate: [AuthGuardService],
    loadComponent: () =>
      import('./modules/wanted/wanted.component').then((m) => m.WantedComponent),
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
