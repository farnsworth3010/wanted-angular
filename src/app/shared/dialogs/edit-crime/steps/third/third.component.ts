import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-edit-third-step',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatStepperModule],
  templateUrl: './third.component.html',
})
export class EditThirdStepComponent {
  @Input() customForm: any;

  @Output() reset = new EventEmitter();
  @Output() send = new EventEmitter();

  resetHandle(): void {
    this.reset.emit();
  }

  sendHandle(): void {
    this.send.emit();
  }
}
