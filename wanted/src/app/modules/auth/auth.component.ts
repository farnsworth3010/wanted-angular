import { ChangeDetectionStrategy, Component } from '@angular/core';
import {provideRouter, RouterModule, RouterOutlet} from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class AuthComponent {

}
