import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SettingsService } from './core/services/settings.service';

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
  constructor(private settingsService: SettingsService) {}
  @HostBinding('@.disabled') get animationsDisabled() {
    return !this.settingsService.animations;
  }
  ngOnInit(): void {
    // todo (theme check)
  }
}
