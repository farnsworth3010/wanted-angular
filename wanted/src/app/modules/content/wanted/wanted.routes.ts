import { EditedComponent } from "./edited/edited.component";
import { GlobalComponent } from "./global/global.component";

export const wantedRoutes = [
    {
        path: 'wanted/:id',
        component: GlobalComponent
    },
      {
        // pathMatch: "full",
        path: 'wanted',
        redirectTo: 'wanted/1'
      },
    {
        path: 'edited',
        component: EditedComponent
    }
]