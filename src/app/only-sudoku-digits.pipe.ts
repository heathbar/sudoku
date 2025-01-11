import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'onlySudokuDigits'
})
export class OnlySudokuDigitsPipe implements PipeTransform {

  transform(value: number): number | undefined {
    if (value > 0 && value < 10) {
      return value;
    }
    return undefined;
  }

}
