import {Routes} from "@angular/router";
import {SettingsComponent} from "./settings/settings.component";
import {ContentComponent} from "./content.component";
import {WantedComponent} from "./wanted/wanted.component";
import {HomeComponent} from "./home/home.component";

export const contentRoutes: Routes = [
  {
    path: '',
    component: ContentComponent,
    children: [

      {
        path: 'home',
        component: HomeComponent
      },
      {
        pathMatch: "full",
        path: 'wanted',
        redirectTo: 'wanted/1'
      },
      {
        path: 'wanted/:id',
        component: WantedComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
    ]
  }
]
