import { Injectable, signal, Signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GridService {

  puzzle: WritableSignal<number>[][] = [[],[],[],[],[],[],[],[],[]];

  constructor() {
    this.reset();
  }

  load(puz: number[][]){
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        this.puzzle[r][c].set(puz[r][c]);
      }
    }
    return this.puzzle;
  }

  getCell(row: number, col: number) {
    return this.puzzle[row][col];
  }

  getBox(i: number) {

    let r = 0;
    if (i < 3) {
      r = 0;
    } else if (i < 6) {
      r = 3;
    } else if (r < 9) {
      r = 6;
    }

    const offset = (i % 3 * 3);
    
    return [
      this.puzzle[r][0 + offset],
      this.puzzle[r][1 + offset],
      this.puzzle[r][2 + offset],

      this.puzzle[r + 1][0 + offset],
      this.puzzle[r + 1][1 + offset],
      this.puzzle[r + 1][2 + offset],

      this.puzzle[r + 2][0 + offset],
      this.puzzle[r + 2][1 + offset],
      this.puzzle[r + 2][2 + offset],

      
    ]
  }

  reset() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        this.puzzle[r][c] = signal(0);
      }
    }
    return this.puzzle;
  }
}
