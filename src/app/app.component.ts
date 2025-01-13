import { Component, inject } from '@angular/core';
import { GridComponent } from './grid/grid.component';
import { SudokuService } from './sudoku.service';
import { GridService } from './grid.service';

@Component({
  selector: 'app-root',
  imports: [GridComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  sudoku = inject(SudokuService);
  grid = inject(GridService);
  
  async loadPuzzle(i: number) {
    this.sudoku.loadPuzzle(`puzzle${i}`);
  }

  solve() {
    this.sudoku.solve();
  }
}
