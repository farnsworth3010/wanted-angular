import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';

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
      link: '/content/home',
      icon: 'home',
      name: 'Home'
    },
    {
      link: '/content/crimes/',
      icon: 'star',
      name: 'Wanted'
    },
    {
      link: '/content/settings',
      icon: 'settings',
      name: 'settings'
    },
  ]
}
