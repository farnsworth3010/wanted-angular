import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    MatCardModule,
    MatSlideToggleModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatSnackBarModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  constructor(private destroyRef: DestroyRef, private snackBar: MatSnackBar) {}

  field_office: FormControl = new FormControl('any');
  animations: FormControl = new FormControl(false);
  darkTheme: FormControl = new FormControl(false);
  offices = ['any', 'miami', 'phoenix'];

  ngOnInit(): void {
    const office: string | null = localStorage.getItem('field_office');
    const animations: boolean | null = JSON.parse(localStorage.getItem('animations')!);

    this.field_office.setValue(office ?? 'any');
    this.animations.setValue(animations !== null ? animations : true);

    this.field_office.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      localStorage.setItem('field_office', this.field_office.value);
    });

    this.animations.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.snackBar
        .open('Action requires page reloading', 'reload', { duration: 3000 })
        .onAction()
        .subscribe(() => {
          window.location.reload();
        });
      localStorage.setItem('animations', this.animations.value);
    });
  }
}
