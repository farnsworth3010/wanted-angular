import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-custom-toggle',
  standalone: true,
  imports: [],
  templateUrl: './custom-toggle.component.html',
  styleUrl: './custom-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomToggleComponent {

}
