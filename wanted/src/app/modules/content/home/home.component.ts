import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FooterComponent } from "../../../shared/footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule,FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
}
