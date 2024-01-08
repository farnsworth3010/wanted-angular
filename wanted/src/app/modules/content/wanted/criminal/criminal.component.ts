import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { DefaultFieldValuePipe } from "../../../../shared/pipes/default-field-value.pipe";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { ImageFallbackDirective } from "../../../../shared/directives/image-fallback.directive";
import { Crime } from "../../../../core/services/interfaces/crime";

@Component({
  selector: "app-criminal",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, DefaultFieldValuePipe, MatButtonModule, ImageFallbackDirective],
  templateUrl: "./criminal.component.html",
  styleUrl: "./criminal.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CriminalComponent {
  @Input() openToDelete: boolean = false;
  @Input() firebaseId!: string;
  @Input() openToEdit: boolean = false;
  @Input() edited: boolean = false;
  @Input() tr!: Crime;
  @Input() i: number = 0;

  @Output() viewInEditsClick = new EventEmitter();
  @Output() personClick = new EventEmitter();
  @Output() selectClick = new EventEmitter();
  @Output() deleteClick = new EventEmitter();
  @Output() editClick = new EventEmitter();

  public selectPerson(i: number): void {
    this.personClick.emit(i);
  }

  public editHandle($event: Event, tr: Crime): void {
    $event.stopPropagation()
    this.editClick.emit({ tr });
  }

  public deleteHandle($event: Event): void {
    $event.stopPropagation()
    this.deleteClick.emit({ id: this.firebaseId });
  }

  public viewInEditsHandle($event: Event, tr: Crime): void {
    $event.stopPropagation()
    this.viewInEditsClick.emit({ tr });
  }
}
