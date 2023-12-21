import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DetailsComponent } from '../details/details.component';

@Component({
  selector: 'app-edited',
  standalone: true,
  imports: [CommonModule, DetailsComponent],
  templateUrl: './edited.component.html',
  styleUrl: './edited.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditedComponent {
  edited: any
}
