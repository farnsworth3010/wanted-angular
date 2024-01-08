import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultFieldValue',
  standalone: true
})
export class DefaultFieldValuePipe implements PipeTransform {
  transform(value: string | number | null | undefined): string {
    return String(value ?? 'unknown')
  }
}
