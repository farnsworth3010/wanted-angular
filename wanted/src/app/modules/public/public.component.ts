import { ChangeDetectionStrategy, Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './public.component.html',
  styleUrl: './public.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicComponent {

}
