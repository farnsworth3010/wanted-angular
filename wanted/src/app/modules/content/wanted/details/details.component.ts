import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DefaultFieldValuePipe } from '../../../../shared/pipes/default-field-value.pipe';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    DefaultFieldValuePipe,
    CommonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsComponent {
  @Input() selectedPerson: any
}
