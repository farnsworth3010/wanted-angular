import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { authRouteAnimation } from '../../core/animations';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="background"></div>
    <div [@authRouteAnimations]="getAnimationsData()">
      <router-outlet />
    </div>
  `,
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [authRouteAnimation],
})
export class AuthComponent {
  constructor(private contexts: ChildrenOutletContexts) {}
  getAnimationsData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
