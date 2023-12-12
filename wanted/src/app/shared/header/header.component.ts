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
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';
import { User } from 'firebase/auth';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnChanges, OnInit {
  constructor(
    public router: Router,
    private changeDetector: ChangeDetectorRef,
    private authService: AuthService
  ) {
    router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.changeDetector.detectChanges();
      });
  }
  userData: any = {};
  ngOnInit(): void {
    this.authService.stateItem$.subscribe(() => {
      this.userData = this.authService.userData;
      this.changeDetector.detectChanges();
    });
  }
  logOut(): void {
    this.authService.signOut().subscribe(() => {
      this.authService.clearUser();
    });
  }
  ngOnChanges() {}
}
