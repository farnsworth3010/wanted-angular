import {
  APP_INITIALIZER,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { LoginComponent } from './modules/login/login.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import { filter } from 'rxjs';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    LoginComponent,
    MatSidenavModule,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  sidenavOpened = false;
  constructor(
    public router: Router,
    private changeDetector: ChangeDetectorRef
  ) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.sidenavOpened = router.url !== '/login' && router.url !== '/';
        changeDetector.detectChanges();
      });
  }
  title = 'wanted';
  @HostBinding('@.disabled')
  public animationsDisabled = true;
}
