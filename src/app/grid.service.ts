import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GridService {

  puzzle: WritableSignal<number>[][] = [[],[],[],[],[],[],[],[],[]];
  givenDigits: WritableSignal<boolean>[][] = [[],[],[],[],[],[],[],[],[]];
  pencilMarks: number[][][] = [[],[],[],[],[],[],[],[],[]];

  constructor() {
    this.reset();
  }

  load(puz: number[][]){
    this.pencilMarks = [[],[],[],[],[],[],[],[],[]];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        this.puzzle[r][c].set(puz[r][c]);
        const [box, index] = this.rowColumnToBoxIndex(r, c);
        this.givenDigits[box][index].set(puz[r][c] !== 0);
      }
    }
    return this.puzzle;
  }

  isSolved() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (this.puzzle[r][c]() === 0) {
          return false;
        }
      }
    }
    return true;
  }

  getRowNumFromBoxIndex(boxNum: number, index: number) {
    if (index < 3) {
      return 0 + Math.floor(boxNum / 3) * 3;
    } else if (index < 6) {
      return 1 + Math.floor(boxNum / 3) * 3;
    } else {
      return 2 + Math.floor(boxNum / 3) * 3;
    }
  }

  getRowFromBoxIndex(boxNum: number, index: number) {
    return this.getRow(this.getRowNumFromBoxIndex(boxNum, index));
  }

  getColumnNumFromBoxIndex(boxNum: number, index: number) {
    if (index % 3 === 0) {
      return 0 + Math.floor(boxNum % 3) * 3;
    } else if (index % 3 === 1) {
      return 1 + Math.floor(boxNum % 3) * 3;
    } else {
      return 2 + Math.floor(boxNum % 3) * 3;
    }
  }
  getColumnFromBoxIndex(boxNum: number, index: number) {
    return this.getColumn(this.getColumnNumFromBoxIndex(boxNum, index));
  }

  getRow(row: number) {
    return this.puzzle[row];
  }

  getColumn(col: number) {
    return this.puzzle.map(r => r[col]);
  }

  getCell(row: number, col: number) {
    return this.puzzle[row][col];
  }

  rowColumnToBoxIndex(r: number, c: number): number[] {
    let box = 0;
    if (c < 3) {
      box = 0 + Math.floor(r / 3) * 3;
    } else if (c < 6) {
      box = 1 + Math.floor(r / 3) * 3;
    } else if (c < 9) {
      box = 2 + Math.floor(r / 3) * 3;
    }

    let index = c % 3 + (3 * (r % 3));

    return [box, index];
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
        this.givenDigits[r][c] = signal(false);
      }
    }
    return this.puzzle;
  }
}
