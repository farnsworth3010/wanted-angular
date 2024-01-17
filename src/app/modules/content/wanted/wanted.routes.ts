import { EditedComponent } from './edited/edited.component';
import { GlobalComponent } from './global/global.component';

export const wantedRoutes = [
  {
    path: 'wanted/:id',
    component: GlobalComponent,
  },
  {
    path: 'wanted',
    redirectTo: 'wanted/1',
  },
  {
    path: 'edited',
    component: EditedComponent,
  },
  {
    path: '**',
    redirectTo: 'wanted/1',
  },
];
