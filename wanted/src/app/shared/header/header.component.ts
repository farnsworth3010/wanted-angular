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
    private changeDetector: ChangeDetectorRef
  ) {
    router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.userInfo.firstname = localStorage.getItem('firstname')!;
      changeDetector.detectChanges();
    });
  }
  userInfo = {
    firstname: 'guest',
  };
  logOut(): void {
    this.router.navigate(['/login']);
    localStorage.clear();
  }
  ngOnChanges() {
  }
}
