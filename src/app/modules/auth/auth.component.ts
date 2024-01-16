import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from '../../core/animations';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="background"></div>
    <router-outlet />
  `,
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInAnimation],
})
export class AuthComponent {}
