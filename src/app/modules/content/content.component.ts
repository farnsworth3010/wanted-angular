import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChildrenOutletContexts, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { slideInAnimation } from '../../core/animations';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, MatSidenavModule, RouterLink, MatIconModule, RouterLinkActive],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInAnimation],
})
export class ContentComponent {
  menuItems = [
    {
      link: '/content/home',
      icon: 'home',
      name: 'Home',
    },
    {
      link: '/content/crimes/',
      icon: 'star',
      name: 'Wanted',
    },
    {
      link: '/content/settings',
      icon: 'settings',
      name: 'Settings',
    },
  ];
  constructor(private contexts: ChildrenOutletContexts) {}
  getAnimationsData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
