import { Component, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridService } from '../grid.service';
import { OnlySudokuDigitsPipe } from '../only-sudoku-digits.pipe';

@Component({
  selector: 'sudoku-grid',
  imports: [CommonModule, OnlySudokuDigitsPipe],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent {

  grid = inject(GridService);
  puzzle: Signal<number>[][] = [
    this.grid.getBox(0),
    this.grid.getBox(1),
    this.grid.getBox(2),
    this.grid.getBox(3),
    this.grid.getBox(4),
    this.grid.getBox(5),
    this.grid.getBox(6),
    this.grid.getBox(7),
    this.grid.getBox(8)
  ];

  given: Signal<boolean>[][] = this.grid.givenDigits;
  get pencil(): number[][][] {
    return this.grid.pencilMarks;
  }

  
  
}