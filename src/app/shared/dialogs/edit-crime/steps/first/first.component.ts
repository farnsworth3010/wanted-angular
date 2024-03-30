import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormField } from '../../../../../core/interfaces/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-first-step',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatStepperModule,
    MatDialogModule
  ],
  styleUrl: './first.component.scss',
  templateUrl: './first.component.html',
})
export class EditFirstStepComponent {
  @Input() customForm: any;

  formFields: FormField[] = [
    {
      placeholder: 'Title',
      formControlName: 'title',
    },
    {
      placeholder: 'Hair',
      formControlName: 'hair',
    },
    {
      placeholder: 'Race',
      formControlName: 'race',
    },
    {
      placeholder: 'Eyes',
      formControlName: 'eyes',
    },
    {
      placeholder: 'Reward',
      formControlName: 'reward_text',
    },
  ];
}
