import { CommonModule } from '@angular/common';
import {ChangeDetectionStrategy, Component, importProvidersFrom} from '@angular/core';
import {provideRouter, RouterLink, RouterLinkActive, RouterModule, RouterOutlet} from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { FooterComponent } from '../../shared/footer/footer.component';
import {contentRoutes} from "./content.routes";
import {routes} from "../../app.routes";

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    HeaderComponent,
    MatSidenavModule,
    RouterLink,
    MatIconModule,
    RouterLinkActive,
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentComponent {
  menuItems: any = [
    {
      link: ['/content/home'],
      icon: 'home',
      name: 'Home'
    },
    {
      link: ['/content/wanted', 1],
      icon: 'star',
      name: 'Wanted'
    },
    {
      link: ['/content/settings'],
      icon: 'settings',
      name: 'settings'
    },
  ]
}
