import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DefaultFieldValuePipe } from '../../../../shared/pipes/default-field-value.pipe';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ImageFallbackDirective } from '../../../../shared/directives/image-fallback.directive';
import { Crime } from '../../../../core/interfaces/crime';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-criminal',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    DefaultFieldValuePipe,
    MatButtonModule,
    ImageFallbackDirective,
    MatProgressSpinnerModule,
  ],
  templateUrl: './criminal.component.html',
  styleUrl: './criminal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CriminalComponent {
  @Input() openToDelete: boolean = false;
  @Input() openToEdit: boolean = false;
  @Input() edited: boolean = false;
  @Input() data!: Crime;

  @Output() viewInEditsClick = new EventEmitter();
  @Output() personClick = new EventEmitter();
  @Output() selectClick = new EventEmitter();
  @Output() deleteClick = new EventEmitter();
  @Output() editClick = new EventEmitter();

  public selectPerson(): void {
    this.personClick.emit();
  }

  public selectPersonFromBtn($event: Event): void {
    $event.stopPropagation();
    this.selectPerson();
  }

  public editHandle($event: Event): void {
    $event.stopPropagation();
    this.editClick.emit();
  }

  public deleteHandle($event: Event): void {
    $event.stopPropagation();
    this.deleteClick.emit();
  }

  public viewInEditsHandle($event: Event): void {
    $event.stopPropagation();
    this.viewInEditsClick.emit();
  }
}
