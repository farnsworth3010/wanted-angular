import { AuthGuardService } from './core/services/auth.guard.service';
import { LoginResolveService } from './core/services/login.resolve.service';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./modules/public/public.component').then(
        (m) => m.PublicComponent
      ),
  },
  {
    path: 'content',
    loadComponent: () =>
      import('./modules/content/content.component').then(
        (m) => m.ContentComponent
      ),
    children: [
      {
        path: 'home',
        canActivate: [AuthGuardService],
        loadComponent: () =>
          import('./modules/content/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'wanted/:id',
        canActivate: [AuthGuardService],
        loadComponent: () =>
          import('./modules/content/wanted/wanted.component').then(
            (m) => m.WantedComponent
          ),
      },
      {
        path: 'wanted',
        canActivate: [AuthGuardService],
        loadComponent: () =>
          import('./modules/content/wanted/wanted.component').then(
            (m) => m.WantedComponent
          ),
      },
      {
        path: 'settings',
        canActivate: [AuthGuardService],
        loadComponent: () =>
          import('./modules/content/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
      },
    ],
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./modules/auth/auth.component').then((m) => m.AuthComponent),
    children: [
      {
        path: 'sign-in',
        resolve: {
          ready: LoginResolveService,
        },
        loadComponent: () =>
          import('./modules/auth/signin/sign-in.component').then(
            (m) => m.SigninComponent
          ),
      },
      {
        path: 'sign-up',
        resolve: {
          ready: LoginResolveService,
        },
        loadComponent: () =>
          import('./modules/auth/signup/sign-up.component').then(
            (m) => m.SignupComponent
          ),
      },
      {
        path: 'verify-email-address',
        loadComponent: () =>
          import(
            './modules/auth/verify-email-address/verify-email-address.component'
          ).then((m) => m.VerifyEmailAddressComponent),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./modules/auth/forgot-password/forgot-password.component').then(
            (m) => m.ForgotPasswordComponent
          ),
      },
    ],
  },
];
