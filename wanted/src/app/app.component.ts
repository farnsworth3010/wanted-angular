import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { SigninComponent} from './modules/auth/signin/sign-in.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SigninComponent,
    MatSidenavModule,
    RouterLink,
    MatIconModule,
    RouterLinkActive,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
})
export class AppComponent {
  constructor(public router: Router) {}
  @HostBinding('@.disabled') public animationsDisabled = true;
}
