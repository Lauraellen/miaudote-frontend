import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

@Pipe({
  name: 'dynamic'
})
export class DynamicPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

  formatDate(value: string): string {
    console.debug(value)
    if (value == null || value == "null" || value == undefined || value == 'undefined') {
      return "";
    }
    return format(new Date(value), 'dd/MM/yyyy');
  }
}
