import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SettingsService } from '../../../core/services/settings.service';

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
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  constructor(private destroyRef: DestroyRef, private settingsService: SettingsService) {}

  field_office: FormControl = new FormControl('any');
  animations: FormControl = new FormControl(true);
  darkTheme: FormControl = new FormControl(false);
  offices = ['any', 'miami', 'phoenix'];

  ngOnInit(): void {
    this.settingsService.$animationsState
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: boolean) => this.animations.setValue(res));

    this.settingsService.$officeState
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: string) => this.field_office.setValue(res));

    this.field_office.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.settingsService.officeState.next(this.field_office.value);
      localStorage.setItem('field_office', this.field_office.value);
    });

    this.animations.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.settingsService.animationsState.next(this.animations.value);
      localStorage.setItem('animations', this.animations.value);
    });
  }
}
