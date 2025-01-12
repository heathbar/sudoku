import { inject, Injectable } from '@angular/core';
import { GridService } from './grid.service';

@Injectable({
  providedIn: 'root'
})
export class SolverService {
  grid = inject(GridService);

  constructor() { }

  async sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }

  async solve() {

    let changesFound = true;

    while (!this.grid.isSolved() && changesFound) {

      this.pencilMark();

      changesFound = 
        this.simpleBoxFind() ||      
        this.simpleRowFind() ||
        this.simpleColumnFind() ||
        this.findNakedSingles() ||
        this.everyRowNeedsEveryDigit() ||
        this.everyColumnNeedsEveryDigit();
      await this.sleep(100);
    }

    if (!this.grid.isSolved()) {
      console.log('STUCK!!!!!!!!!!!');
    } else {
      console.log('SOLVED!!!!');
    }
    
  }

  pencilMark() {
    for (let boxNum = 0; boxNum < 9; boxNum++) {
      for (let index = 0; index < 9; index++) {

        const possibleDigits = [];
        // const r = this.grid.getRowFromBoxIndex(boxNum, index);
        // const c = this.grid.getColumnFromBoxIndex(boxNum, index);

        // if the cell is filled, move on
        if (this.grid.getBox(boxNum)[index]() !== 0) {
          continue;
        }

        for (let d = 1; d < 10; d++) {
          if (this.grid.getRowFromBoxIndex(boxNum, index).find(n => n() === d)) {
            continue;
          }

          if (this.grid.getColumnFromBoxIndex(boxNum, index).find(n => n() === d)) {
            continue;
          }

          if (this.grid.getBox(boxNum).find(n => n() === d)) {
            continue;
          }

          possibleDigits.push(d);
        }

        if (possibleDigits.length === 1) {
          console.log(`Found a naked single (${possibleDigits[0]}) in box ${boxNum}, index ${index}.`);
          this.grid.getBox(boxNum)[index].set(possibleDigits[0]);
        } else {
          this.grid.pencilMarks[boxNum][index] = possibleDigits;
        }
      }
    }
    console.log('Pencil Marks: ', this.grid.pencilMarks);
  }

  simpleBoxFind() {
    let found = false;
    for (let d = 1; d < 10; d++) {
      for (let b = 0; b < 9; b++) {
        if (this.simpleFindDigitInBox(d, b)) {
          found = true;
        }
      }
    }
    return found;
  }

  // returns true if any digits were found
  simpleFindDigitInBox(digit: number, boxNum: number): boolean {
    console.debug(`Finding ${digit} in box ${boxNum + 1}...`);

    const box = this.grid.getBox(boxNum);

    if (box.find(d => d() === digit)) {
      return false;
    }

    // TODO eliminate cells using rows & cols until only 1 remains

    // loop through each cell in the box
    //  if the cell cannot be disqualified due to
    //    - the cell is filled
    //    - the digit exists in the same column
    //    - the digit exists in the same row
    //  then mark it as possible
    // if only one possible cell, set the digit
    
    let possibleCells = [];
    for (let i = 0; i < 9; i++) {
      if (box[i]() !== 0) {
        continue;
      }


      // inefficient, checking the same row 3 times
      if (this.grid.getRowFromBoxIndex(boxNum, i).find(cell => cell() === digit)) {
        // console.debug(`Found ${digit} in same row`);
        continue;
      }

      if (this.grid.getColumnFromBoxIndex(boxNum, i).find(cell => cell() === digit)) {
        // console.debug(`Found ${digit} in same column`);
        continue;
      }

      possibleCells.push(i);
      // console.log('COLUMN: ' + this.grid.getColumn(6).map(c => c()));
    }

    if (possibleCells.length === 1) {
      console.log(`Found ${digit} in box ${boxNum} at index ${possibleCells[0]}`);
      this.grid.getBox(boxNum)[possibleCells[0]].set(digit);
      return true;
    }

    return false;
  }


  simpleRowFind() {
    let found = false;
    for (let d = 1; d < 10; d++) {
      for (let r = 0; r < 9; r++) {
        if (this.findDigitInRow(d, r)) {
          found = true;
        }
      }
    }
    return found;
  }

  findDigitInRow(digit: number, rowNum: number) {
    const possibleCells = [];
    const row = this.grid.getRow(rowNum);

    for (let i = 0; i < 9; i++) {
      // if the digit is in this cell, exit.
      if (row[i]() === digit) {
        return false;
      }

      // if the cell is already filled, skip
      if (row[i]() !== 0) {
        continue;
      }

      // if the digit exists in the perpendicular column, skip
      if (this.grid.getColumn(i).find(n => n() === digit)) {
        continue;
      }

      // if the digit exists in the box, skip
      const [boxNum, index] = this.grid.rowColumnToBoxIndex(rowNum, i);
      if (this.grid.getBox(boxNum).find(n => n() === digit)) {
        continue;
      }

      possibleCells.push(i);
    }

    if (possibleCells.length === 1) {
      console.log(`Found ${digit} in row ${rowNum} at index ${possibleCells[0]}`);
      row[possibleCells[0]].set(digit);
      return true;
    }
    return false;
  }

  simpleColumnFind() {
    let found = false;
    for (let d = 1; d < 10; d++) {
      for (let c = 0; c < 9; c++) {
        if (this.findDigitInColumn(d, c)) {
          found = true;
        }
      }
    }
    return found;
  }

  findDigitInColumn(digit: number, colNum: number) {
    const possibleCells = [];
    const column = this.grid.getColumn(colNum);

    for (let i = 0; i < 9; i++) {
      // if the digit is in this cell, exit.
      if (column[i]() === digit) {
        return false;
      }

      // if the cell is already filled, skip
      if (column[i]() !== 0) {
        continue;
      }

      // if the digit exists in the perpendicular row, skip
      if (this.grid.getRow(i).find(n => n() === digit)) {
        continue;
      }

      // if the digit exists in the box, skip
      const [boxNum, index] = this.grid.rowColumnToBoxIndex(i, colNum);
      if (this.grid.getBox(boxNum).find(n => n() === digit)) {
        continue;
      }

      possibleCells.push(i);
    }

    if (possibleCells.length === 1) {
      console.log(`Found ${digit} in column ${colNum} at index ${possibleCells[0]}`);
      column[possibleCells[0]].set(digit);
      return true;
    }
    return false;
  }

  findNakedSingles() {
    let found = false;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {

        const possibleDigits = [];

        // if the cell is filled, move on
        if (this.grid.puzzle[r][c]() !== 0) {
          continue;
        }

        for (let d = 1; d < 10; d++) {
          //  if the row contains the digit, move on
          if (this.grid.getRow(r).find(n => n() === d)) {
            continue;
          }
          // if the column contains the digit, move on
          if (this.grid.getColumn(c).find(n => n() === d)) {
            continue;
          }

          // if the box contains the digit, move on
          const [boxNum] = this.grid.rowColumnToBoxIndex(r, c);
          if (this.grid.getBox(boxNum).find(n => n() === d)) {
            continue;
          }

          possibleDigits.push(d);
        }

        if (possibleDigits.length === 1) {
          console.log(`Found a naked single (${possibleDigits[0]}) at [${r},${c}].`);
          this.grid.puzzle[r][c].set(possibleDigits[0]);
          found = true;
        }
      }
    }
    return found;
  }


  everyRowNeedsEveryDigit() {
    let found = false;
    for (let r = 0; r < 9; r++) {
      for (let d = 1; d < 10; d++) {
        let possiblePositions: number[] = [];

        for (let c = 0; c < 9; c++) {

          // if the current cell contains the digit, skip ahead
          if (this.grid.puzzle[r][c]() === d) {
            continue;
          }

          this.grid.pencilMarks[r].forEach(n => {
            if (n?.includes(d)) {
              possiblePositions.push(d);
            }
          });
        }

        if (possiblePositions.length === 1) {
          console.log(`Every row needs a (${d}) in row ${r}.`);
          this.grid.puzzle[r][possiblePositions[0]].set(d);
          found = true;
        }
      }
    }
    return found;
  }

  everyColumnNeedsEveryDigit() {
    let found = false;
    for (let c = 0; c < 9; c++) {
      for (let d = 1; d < 10; d++) {
        let possiblePositions: number[] = [];

        for (let r = 0; r < 9; r++) {

          // if the current cell contains the digit, skip ahead
          if (this.grid.puzzle[r][c]() === d) {
            continue;
          }

          this.grid.pencilMarks.map(r => r[c]).forEach(n => {
            if (n?.includes(d)) {
              possiblePositions.push(d);
            }
          });
        }

        if (possiblePositions.length === 1) {
          console.log(`Every column needs a (${d}) in column ${c}.`);
          this.grid.puzzle[possiblePositions[0]][c].set(d);
          found = true;
        }
      }
    }
    return found;
  }

  findPairs() {
    // some planning needed

    // find pairs in rows, columns & boxes... and cells?
    // store this in an object
    // use it in all the other methods to disqualify cells
  }


}
