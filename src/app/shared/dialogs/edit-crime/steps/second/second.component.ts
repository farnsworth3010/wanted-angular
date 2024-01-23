import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, Signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { CustomField } from '../../../../../core/interfaces/custom-field';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-edit-second-step',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  styleUrl: './second.component.scss',
  templateUrl: './second.component.html',
})
export class EditSecondStepComponent implements OnInit {
  constructor(private destroyRef: DestroyRef) {}
  fieldTypes: string[] = ['text', 'date', 'number', 'checkbox'];
  @Input({ required: true }) addFieldDisabled: boolean = false;
  @Input({ required: true }) addFieldForm: any;
  @Input() customFields!: Observable<Record<string, CustomField>>;
  fields!: any[];

  @Output() addField = new EventEmitter();
  @Output() applyEdit = new EventEmitter();
  @Output() toggleFieldEdit = new EventEmitter();
  @Output() deleteField = new EventEmitter();
  ngOnInit(): void {
    this.customFields.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res: Record<string, CustomField>) => {
      this.fields = Object.keys(res).map((value: string) => ({
        name: value,
        type: res[value].type,
        isEditing: res[value].isEditing,
      }));
    });
  }

  applyEditHandle(name: string, type: string, nameInput: HTMLInputElement, typeInput: MatSelect): void {
    this.applyEdit.emit({ name, type, nameInput, typeInput });
  }

  toggleFieldEditHandle(name: string): void {
    this.toggleFieldEdit.emit(name);
  }

  deleteFieldHandle(id: number): void {
    this.deleteField.emit(id);
  }

  addFieldHandle(): void {
    this.addField.emit();
  }
}
