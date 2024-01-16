import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DefaultFieldValuePipe } from '../../../../shared/pipes/default-field-value.pipe';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImageFallbackDirective } from '../../../../shared/directives/image-fallback.directive';
import { Crime } from '../../../../core/services/interfaces/crime';
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [DefaultFieldValuePipe, CommonModule, MatProgressSpinnerModule, ImageFallbackDirective],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent {
  @Input() selectedPerson: null | Crime = null;
  @Input() data: null | Crime[] = null;
  @Input() fetching: boolean = true;
}
