import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'flupp'
})
export class FluppPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    let arrayFromString = Array.from(value.toString().split(''));
    let fLetter = arrayFromString.shift().toUpperCase();
    return fLetter + arrayFromString.join('');
  }

}
