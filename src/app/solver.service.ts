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
    this.grid.status.set('Solving');

    let changesFound = true;
    let counter = 0;

    while (!this.grid.isSolved() && changesFound) {

      changesFound = 
        this.pencilMark() ||
        this.simpleBoxFind() ||
        this.simpleRowFind() ||
        this.simpleColumnFind() ||
        this.findNakedSingles() ||
        this.everyRowNeedsEveryDigit() ||
        this.everyColumnNeedsEveryDigit() ||
        this.everyBoxNeedsEveryDigit();
      await this.sleep(30);
      counter++;
      console.log(counter);
    }

    if (!this.grid.isSolved()) {
      this.grid.status.set('Stuck');
    } else {
      this.grid.status.set('Solved');
    }
    
  }


  // Mark the available digits in each cell
  pencilMark(): boolean {
    let found = false;

    // First Pass: mark in potential values for each cell, looking at row, column & box to exclude posibilities for the cell.
    for (let boxNum = 0; boxNum < 9; boxNum++) {
      for (let index = 0; index < 9; index++) {

        const possibleDigits = [];

        // if the cell is filled, erase pencil marks and move on
        if (this.grid.getBox(boxNum)[index]() !== 0) {
          this.grid.clearPencilMarks(boxNum, index);
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
          console.log(`Found a naked single while pencil marking (${possibleDigits[0]}) in box ${boxNum}, index ${index}.`);
          this.grid.getBox(boxNum)[index].set(possibleDigits[0]);
          this.grid.clearPencilMarks(boxNum, index);
          found = true;
        } else {
          this.grid.setPencilMarks(boxNum, index, possibleDigits);
        }
      }
    }

    // // Second Pass: for each cell consider the two adjacent boxes and remove values that must be elsewhere in the row 
    const boxNums = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    for (let boxNum = 0; boxNum < 9; boxNum++) {
      for (let index = 0; index < 9; index++) {

        // if the cell is filled, move on
        if (this.grid.getBox(boxNum)[index]() !== 0) {
          continue;
        }

        this.grid.getPencilMarks(boxNum, index).forEach(d => {

          const horizNeighbors = boxNums.filter(n => n !== boxNum && Math.floor(n / 3) === Math.floor(boxNum / 3));

          const cellsToCheck: number[] = [];

          if (index < 3) {
            cellsToCheck.push(...[3,4,5,6,7,8]);
          } else if (index < 6) {
            cellsToCheck.push(...[0,1,2,6,7,8]);
          } else {
            cellsToCheck.push(...[0,1,2,3,4,5]);
          }

          horizNeighbors.forEach(neighbor => {

            if (this.grid.getBox(neighbor).find(cell => cell() === d)) {
              return;
            }

            // try to find a pencil mark in a neighboring box that is in a different row
            let uncertaintyFound = false;
            cellsToCheck.forEach(cellNum => {
              if (this.grid.getPencilMarks(neighbor, cellNum).includes(d)) {
                uncertaintyFound = true;
              }
            });

            if (!uncertaintyFound) {
              console.log(`Removing ${d} from pencil marks in box ${boxNum}, index ${index} due to the situation in box ${neighbor}.`)
              this.grid.setPencilMarks(boxNum, index, this.grid.getPencilMarks(boxNum, index)?.filter(p => p !== d));

              if (this.grid.getPencilMarks(boxNum, index).length === 1) {
                console.log(`Found a naked single while pencil marking (${this.grid.getPencilMarks(boxNum, index)[0]}) in box ${boxNum}, index ${index}.`);
                this.grid.getBox(boxNum)[index].set(this.grid.getPencilMarks(boxNum, index)[0]);
                found = true;
              }
            }
          });
        });
      }
    }

    // Third Pass: for each cell consider the two adjacent boxes and remove values that must be elsewhere in the column 

    for (let boxNum = 0; boxNum < 9; boxNum++) {
      for (let index = 0; index < 9; index++) {

        // if the cell is filled, move on
        if (this.grid.getBox(boxNum)[index]() !== 0) {
          continue;
        }

        this.grid.getPencilMarks(boxNum, index).forEach(d => {

          const vertNeighbors = boxNums.filter(n => n !== boxNum && Math.floor(n % 3) === Math.floor(boxNum % 3));

          const cellsToCheck: number[] = [];

          if (index % 3 === 0) {
            cellsToCheck.push(...[1,2,4,5,7,8]);
          } else if (index % 3 === 1) {
            cellsToCheck.push(...[0,2,3,5,6,8]);
          } else {
            cellsToCheck.push(...[0,1,3,4,6,7]);
          }

          vertNeighbors.forEach(neighbor => {

            if (this.grid.getBox(neighbor).find(cell => cell() === d)) {
              return;
            }

            // try to find a pencil mark in a neighboring box that is in a different row
            let uncertaintyFound = false;
            cellsToCheck.forEach(cellNum => {
              if (this.grid.getPencilMarks(neighbor, cellNum).includes(d)) {
                uncertaintyFound = true;
              }
            });

            if (!uncertaintyFound) {
              console.log(`Removing ${d} from pencil marks in box ${boxNum}, index ${index} due to the situation in box ${neighbor}.`)
              this.grid.setPencilMarks(boxNum, index, this.grid.getPencilMarks(boxNum, index).filter(p => p !== d));

              if (this.grid.getPencilMarks(boxNum, index).length === 1) {
                console.log(`Found a naked single while pencil marking (${this.grid.getPencilMarks(boxNum, index)[0]}) in box ${boxNum}, index ${index}.`);
                this.grid.getBox(boxNum)[index].set(this.grid.getPencilMarks(boxNum, index)[0]);
                this.grid.clearPencilMarks(boxNum, index);
                found = true;
              }
            }
          });
        });
      }
    }
    return found;
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

  
  simpleFindDigitInBox(digit: number, boxNum: number): boolean {
    console.debug(`Finding ${digit} in box ${boxNum + 1}...`);

    const box = this.grid.getBox(boxNum);

    if (box.find(d => d() === digit)) {
      return false;
    }

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

      // Check if the row already contains the digit
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

          const [box, index] = this.grid.rowColumnToBoxIndex(r, c);

          this.grid.getPencilMarks(box).forEach(n => {
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

          const [box, index] = this.grid.rowColumnToBoxIndex(r, c);

          this.grid.getPencilMarks(box).forEach(n => {
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

  everyBoxNeedsEveryDigit() {
    let found = false;

    for (let boxNum = 0; boxNum < 9; boxNum++) {
      for (let d = 1; d < 10; d++) {
        let possiblePositions: number[] = [];

        for (let index = 0; index < 9; index++) {

          // if the current cell contains the digit, skip ahead
          if (this.grid.getBox(boxNum)[index]() === d) {
            continue;
          }

          this.grid.getPencilMarks(boxNum).forEach(n => {
            if (n?.includes(d)) {
              possiblePositions.push(d);
            }
          });
        }

        if (possiblePositions.length === 1) {
          console.log(`Every box needs a (${d}) in box ${boxNum + 1}.`);
          this.grid.getBox(boxNum)[possiblePositions[0]].set(d);
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
