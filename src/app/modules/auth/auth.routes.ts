import { Routes } from '@angular/router';
import { AuthComponent } from './auth.component';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'sign-in',
        loadComponent: () => import('./sign-in/sign-in.component').then(m => m.SigninComponent),
      },
      {
        path: 'sign-up',
        loadComponent: () => import('./sign-up/sign-up.component').then(m => m.SignupComponent),
      },
      {
        path: 'verify-email-address',
        loadComponent: () =>
          import('./verify-email-address/verify-email-address.component').then(m => m.VerifyEmailAddressComponent),
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
      },
    ],
  },
];
