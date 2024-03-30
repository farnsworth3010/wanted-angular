import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, HostBinding, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SettingsService } from './core/services/settings.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(
    private settingsService: SettingsService,
    private destroyRef: DestroyRef,
    private changeDetectorRef: ChangeDetectorRef,
    private overlayContainer: OverlayContainer
  ) {}

  animations: boolean = true;
  isDark: boolean = false;

  @HostBinding('class') get themeMode() {
    return this.isDark ? 'theme-dark' : 'theme-light';
  }
  @HostBinding('@.disabled') get animationsDisabled() {
    return !this.animations;
  }

  ngOnInit(): void {
    this.settingsService.$animationsState.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res: boolean) => {
      this.animations = res;
      this.changeDetectorRef.markForCheck();
    });
    this.settingsService.$themeState.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res: boolean) => {
      this.isDark = res;
      const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
      const themeClassesToRemove = Array.from(overlayContainerClasses).filter((item: string) =>
        item.includes('theme-')
      );
      if (themeClassesToRemove.length) {
        overlayContainerClasses.remove(...themeClassesToRemove);
      }
      overlayContainerClasses.add(res ? 'theme-dark' : 'theme-light');
      this.changeDetectorRef.markForCheck();
    });
  }
}
