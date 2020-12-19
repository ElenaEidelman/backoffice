import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iO'
})
export class IOPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    let objectToIterableArray = Object.keys(value).map((k) => value[k]);
    return objectToIterableArray;
  }

}
