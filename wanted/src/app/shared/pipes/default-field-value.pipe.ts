import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultFieldValue',
  standalone: true
})
export class DefaultFieldValuePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
      return value ? value : 'unknown'
  }

}
