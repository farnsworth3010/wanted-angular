import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-criminal-skeleton',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './criminal-skeleton.component.html',
  styleUrl: './criminal-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CriminalSkeletonComponent {}
