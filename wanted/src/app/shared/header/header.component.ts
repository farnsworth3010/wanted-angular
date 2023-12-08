import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnInit,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnChanges {
  constructor(
    public router: Router,
    private changeDetector: ChangeDetectorRef,
    private authService: AuthService
  ) {
    router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        if (localStorage.getItem('userInfo')) {
          this.userInfo = JSON.parse(localStorage.getItem('userInfo')!);
        }
        changeDetector.detectChanges();
      });
  }
  userInfo = {
    firstname: 'guest',
  };
  logOut(): void {
    this.authService.Logout() 
  }
  ngOnChanges() {}
}
