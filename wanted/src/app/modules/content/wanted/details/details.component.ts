import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DefaultFieldValuePipe } from '../../../../shared/pipes/default-field-value.pipe';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImageFallbackDirective } from '../../../../shared/directives/image-fallback.directive';
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    DefaultFieldValuePipe,
    CommonModule,
    MatProgressSpinnerModule,
    ImageFallbackDirective
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsComponent {
  @Input() selectedPerson: any
  @Input() data: any
  @Input() fetching: boolean = true
}
