import { Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { ContentComponent } from './content.component';
import { WantedComponent } from './wanted/wanted.component';
import { HomeComponent } from './home/home.component';

export const contentRoutes: Routes = [
  {
    path: '',
    component: ContentComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        data: {
          animation: 'homePage',
        },
      },
      {
        path: 'crimes',
        loadChildren: () => import('./wanted/wanted.routes').then(m => m.wantedRoutes),
        component: WantedComponent,
        data: {
          animation: 'crimesPage',
        },
      },
      {
        path: 'settings',
        component: SettingsComponent,
        data: {
          animation: 'settingsPage',
        },
      },
    ],
  },
];