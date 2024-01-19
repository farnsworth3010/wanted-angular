import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Crime } from '../../../core/interfaces/crime';
import { ImageFallbackDirective } from '../../directives/image-fallback.directive';
import { CommonModule } from '@angular/common';
import { DefaultFieldValuePipe } from '../../pipes/default-field-value.pipe';
import { MatButtonModule } from '@angular/material/button';
import {Clipboard} from '@angular/cdk/clipboard';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-details-dialog',
  standalone: true,
  imports: [ImageFallbackDirective, CommonModule, DefaultFieldValuePipe, MatDialogModule, MatButtonModule],
  templateUrl: './details-dialog.component.html',
  styleUrl: './details-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Crime, private clipboard: Clipboard, private snackBar: MatSnackBar) {}
  copyLink(url: string): void {
    this.clipboard.copy(url)
    this.snackBar.open('Copied!', '', {duration: 1000} )
  }
}
