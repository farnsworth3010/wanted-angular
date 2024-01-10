import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { guest } from '../../core/services/interfaces/guest';
import { IError } from '../../core/services/interfaces/error';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  constructor(
    public router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  @Input() noData: boolean = false;

  userData!: firebase.default.User | guest;

  ngOnInit(): void {
    this.authService.stateItem$.subscribe((res: firebase.default.User | null | guest) => {
      if (res) this.userData = res;
    });
  }

  logOut(): void {
    this.authService.signOut().subscribe({
      next: () => {
        this.authService.clearUser()
      },
      error: (error: IError) => {
        this.snackBar.open(error.message, '', { duration: 3000 });
      }
    });
  }
}
