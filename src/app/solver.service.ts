import { inject, Injectable } from '@angular/core';
import { GridService } from './grid.service';

@Injectable({
  providedIn: 'root'
})
export class SolverService {
  grid = inject(GridService);

  constructor() { }

  solve() {
    for (let d = 1; d < 10; d++) {
      for (let b = 0; b < 9; b++) {
        this.simpleFindDigitInBox(d, b);
      }
    }
  }

  simpleFindDigitInBox(digit: number, box: number) {
    console.log(`Finding ${digit} in box ${box + 1}...`);

    if (this.grid.getBox(box).find(d => d() === digit)) {
      console.log('skip');
      return true;
    }

    // TODO eliminate cells using rows & cols until only 1 remains


    return false;
  }
}
