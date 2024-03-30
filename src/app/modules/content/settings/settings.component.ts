import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SettingsService } from '../../../core/services/settings.service';
import { User } from '../../../core/interfaces/user';
import { AuthService } from '../../../core/services/auth.service';
import { ImageFallbackDirective } from '../../../shared/directives/image-fallback.directive';

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
    ImageFallbackDirective,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  constructor(
    private destroyRef: DestroyRef,
    private settingsService: SettingsService,
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  field_office: FormControl = new FormControl('any');
  animations: FormControl = new FormControl(true);
  darkTheme: FormControl = new FormControl(false);
  offices = ['any', 'miami', 'phoenix'];
  userData: User | null = null;

  ngOnInit(): void {
    const { animationsState, officeState, themeState } = this.settingsService;

    this.userData = this.authService.stateItem.getValue();

    this.animations.setValue(animationsState.getValue());
    this.field_office.setValue(officeState.getValue());
    this.darkTheme.setValue(themeState.getValue());

    this.field_office.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      this.settingsService.saveOfficeState(value);
    });

    this.animations.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      this.settingsService.saveAnimationState(value);
    });

    this.darkTheme.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      this.settingsService.saveThemeState(value);
    });
  }
}
