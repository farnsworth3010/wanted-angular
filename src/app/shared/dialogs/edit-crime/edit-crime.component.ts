import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { from } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Crime } from '../../../core/interfaces/crime';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomField } from '../../../core/interfaces/customField';

@Component({
  selector: 'app-edit-crime',
  standalone: true,
  imports: [
    MatButtonToggleModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogClose,
    CommonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: './edit-crime.component.html',
  styleUrl: './edit-crime.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCrimeComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Crime,
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private dialog: MatDialogRef<EditCrimeComponent>,
    private snackBar: MatSnackBar
  ) {}
  customForm = this.fb.group({
    title: [this.data.title ?? '-', Validators.required],
    sex: [this.data.sex ?? 'Male', Validators.required],
    hair: [this.data.hair],
    race: [this.data.race],
    eyes: [this.data.eyes],
    reward_text: [this.data.reward_text],
  });
  addFieldForm = this.fb.group({
    type: ['', Validators.required],
    name: ['', [Validators.required, this.noRepeatNamesValidator()]],
    fields: this.fb.array([], [Validators.maxLength(3)]),
  });

  customFields: CustomField[] = [];

  sendRequest(): void {
    const { title, sex, hair, race, eyes, reward_text } = this.data;
    const {
      title: formTitle,
      sex: formSex,
      hair: formHair,
      race: formRace,
      eyes: formEyes,
      reward_text: formReward_text,
    } = this.customForm.value;
    // if сравнить поля вместо stringify
    if (
      JSON.stringify({ title, sex, hair, race, eyes, reward_text }) !==
        JSON.stringify({
          title: formTitle,
          sex: formSex,
          hair: formHair,
          race: formRace,
          eyes: formEyes,
          reward_text: formReward_text,
        }) ||
        // controls -> get
      this.addFieldForm.controls.fields.length
    ) {
      this.dialog.close(true);
      this.snackBar.dismiss();
      // вынести в wanted
      from(
        this.afs
          .collection('edited')
          .doc(this.data.uid)
          .set({
            ...this.data,
            title: formTitle,
            sex: formSex,
            hair: formHair,
            race: formRace,
            eyes: formEyes,
            reward_text: formReward_text,
            customFields: this.customFields.map((field: CustomField) => {
              const { name, index } = field;
              return {
                name,
                value: this.addFieldForm.value.fields![index],
                // посмотреть
              };
            }),
          })
      ).subscribe(() => {
        this.dialog.close(true);
      });
    } else {
      this.snackBar.open("You haven't changed anything!", 'dismiss', {
        duration: 3000,
      });
    }
  }

  addField() {
    if (this.addFieldForm.valid) {
      if (this.addFieldForm.value.name) {
        const control = this.fb.control('', Validators.required);
        const { name, type } = this.addFieldForm.getRawValue();
        this.customFields.push({
          index: this.customFields.length,
          name,
          type,
          isEditing: false,
        });
        // controls -> get
        // name в отдельную переменную
        this.addFieldForm.controls.fields.push(control);
        this.addFieldForm.controls.name.reset();
        this.addFieldForm.controls.name.setErrors(null);
      } else {
        this.addFieldForm.controls.name.setErrors({ error: 'invalid' });
      }
    }
  }
  toggleFieldEditById(id: number): void {
  
    this.customFields[id].isEditing = !this.customFields[id].isEditing;
  }
  deleteCustomFieldById(id: number): void {
    this.addFieldForm.controls.fields.removeAt(id);
  }
  applyEditById(id: number, nameInput: HTMLInputElement, typeInput: MatSelect): void {
    // id -> name 
    // деструктуризация
    if (nameInput.value && typeInput.value) {
      this.customFields[id].name = nameInput.value;
      this.customFields[id].type = typeInput.value;
      this.customFields[id].isEditing = false;
    } else {
      nameInput.setCustomValidity('sdf');
      // fix
    }
  }
  // вынести
  // parent -> formarray fix
  // git ветки!!!
  noRepeatNamesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const condition = this.customFields?.find(x => x.name === control.value);
      return condition ? { error: "You can't create repeated fields!" } : null;
    };
  }
}
