import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultFieldValue',
  standalone: true,
})
export class DefaultFieldValuePipe implements PipeTransform {
  transform(value: unknown): string {
    return String(value ?? 'unknown');
  }
}
