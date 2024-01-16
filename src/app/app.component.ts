import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, HostBinding, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SettingsService } from './core/services/settings.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  animations: boolean = true;

  @HostBinding('@.disabled') get animationsDisabled() {
    return !this.animations;
  }

  ngOnInit(): void {
    this.settingsService.$animationsState.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res: boolean) => {
      this.animations = res;
      this.changeDetectorRef.markForCheck()
      console.log('dfs')
    });
  }
}
