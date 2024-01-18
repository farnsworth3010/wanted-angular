import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Crime } from '../../../core/interfaces/crime';
import { ImageFallbackDirective } from '../../directives/image-fallback.directive';
import { CommonModule } from '@angular/common';
import { DefaultFieldValuePipe } from '../../pipes/default-field-value.pipe';

@Component({
  selector: 'app-details-dialog',
  standalone: true,
  imports: [ImageFallbackDirective, CommonModule, DefaultFieldValuePipe],
  templateUrl: './details-dialog.component.html',
  styleUrl: './details-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Crime) {}
}
