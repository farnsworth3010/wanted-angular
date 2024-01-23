import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { CommonModule } from '@angular/common';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Crime } from '../../../core/interfaces/crime';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomField } from '../../../core/interfaces/custom-field';
import { WantedService } from '../../../core/services/wanted.service';
import { EditFirstStepComponent } from './steps/first/first.component';
import { EditThirdStepComponent } from './steps/third/third.component';
import { EditSecondStepComponent } from './steps/second/second.component';
import { noRepeatNamesValidator } from '../../../core/utils/validators/no-repeat-names.validator';
import { BehaviorSubject } from 'rxjs';

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
    EditFirstStepComponent,
    EditSecondStepComponent,
    EditThirdStepComponent,
    MatDialogModule,
  ],
  templateUrl: './edit-crime.component.html',
  styleUrl: './edit-crime.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCrimeComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Crime,
    private fb: FormBuilder,
    private dialog: MatDialogRef<EditCrimeComponent>,
    private snackBar: MatSnackBar,
    private wantedService: WantedService
  ) {}

  customFieldsSubject = new BehaviorSubject<Record<string, CustomField>>({});
  $customFields = this.customFieldsSubject.asObservable();

  customForm = this.fb.group({
    title: [this.data.title ?? '-', Validators.required],
    sex: [this.data.sex ?? 'Male', Validators.required],
    hair: [this.data.hair],
    race: [this.data.race],
    eyes: [this.data.eyes],
    reward_text: [this.data.reward_text],
  });

  addFieldForm = this.fb.group({
    type: ['text', Validators.required],
    name: ['', [Validators.required, noRepeatNamesValidator(this.customFieldsSubject)]],
    fields: this.fb.array([], [Validators.maxLength(3)]),
  });

  addFieldDisabled: boolean = false;
  secondStepOptional: boolean = true;

  send(): void {
    const { title, sex, hair, race, eyes, reward_text, uid } = this.data;
    const {
      title: formTitle,
      sex: formSex,
      hair: formHair,
      race: formRace,
      eyes: formEyes,
      reward_text: formReward_text,
    } = this.customForm.getRawValue();
    if (
      title !== formTitle ||
      sex !== formSex ||
      hair !== formHair ||
      race !== formRace ||
      eyes !== formEyes ||
      reward_text !== formReward_text ||
      this.addFieldForm.get('fields')?.value.length
    ) {
      this.snackBar.dismiss();
      const fields = this.addFieldForm.get('fields') as FormArray;
      const newData = {
        title: formTitle!,
        sex: formSex!,
        hair: formHair!,
        race: formRace!,
        eyes: formEyes!,
        reward_text: formReward_text!,
        uid,
        customFields: Object.keys(this.customFieldsSubject.value).map((name: string, index) => {
          return {
            name,
            value: fields.at(index).getRawValue(),
          };
        }),
      };
      this.dialog.close({ wasEdited: true, data: newData });
      this.wantedService.uploadEdited(this.data.uid, this.data, newData).subscribe(() => {});
    } else {
      this.snackBar.open("You haven't changed anything!", 'dismiss', {
        duration: 3000,
      });
    }
  }

  addField() {
    this.secondStepOptional = false;
    const nameControl = this.addFieldForm.get('name');
    const typeControl = this.addFieldForm.get('type');
    const fields = this.addFieldForm.get('fields') as FormArray;

    if (typeControl?.valid && nameControl?.valid && this.addFieldForm.value.name) {
      const control = this.fb.control('', Validators.required);
      const { name, type } = this.addFieldForm.getRawValue();
      const field = { type, isEditing: false };
      const temp = this.customFieldsSubject.value;
      temp[name!] = field;
      this.customFieldsSubject.next(temp);

      fields.push(control);

      nameControl?.reset();
      nameControl?.setErrors(null);
    }

    if (fields.length > 2) {
      this.addFieldDisabled = true;
    }
  }

  toggleFieldEdit(name: string): void {
    const temp = this.customFieldsSubject.value;
    temp[name].isEditing = !temp[name].isEditing;
    this.customFieldsSubject.next(temp);
  }

  deleteField(name: string): void {
    const fields = this.addFieldForm.get('fields') as FormArray;
    const id = Object.keys(this.customFieldsSubject.value).findIndex((value: string) => value === name);
    fields.removeAt(id);

    const { [name]: _, ...newObj } = this.customFieldsSubject.value;

    this.addFieldDisabled = false;
    this.customFieldsSubject.next(newObj);
    if (!fields.length) {
      this.secondStepOptional = true;
    }
  }

  applyEdit(value: { name: string; type: string; nameInput: HTMLInputElement; typeInput: MatSelect }): void {
    const { name, nameInput, typeInput } = value;
    if (nameInput.value) {
      // if input is not empty
      if (nameInput.value === name) {
        // if name hasn't changed
        const temp = this.customFieldsSubject.value;
        temp[nameInput.value] = {
          type: typeInput.value,
          isEditing: false,
        };
        this.customFieldsSubject.next(temp);
      } else {
        // if new name is different
        if (Object.keys(this.customFieldsSubject.value).findIndex((x: string) => x === nameInput.value) === -1) {
          // if new name is unique
          const fields = this.addFieldForm.get('fields') as FormArray;
          const id = Object.keys(this.customFieldsSubject.value).findIndex((value: string) => value === name);
          const control = this.fb.control('', Validators.required);

          fields.removeAt(id);
          const { [name]: _, ...newObj } = this.customFieldsSubject.value;
          const field = {
            type: typeInput.value,
            isEditing: false,
          };
          newObj[nameInput.value] = field;

          fields.push(control);

          this.customFieldsSubject.next(newObj);
        } else {
          this.snackBar.open('You can create inputs with a unique name only!', 'dismiss', { duration: 3000 });
        }
      }
    } else {
      this.snackBar.open("You can't create inputs with no name!", 'dismiss', { duration: 3000 });
    }
  }
}
