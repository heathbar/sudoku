import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GridComponent } from './grid/grid.component';
import { SudokuService } from './sudoku.service';

@Component({
  selector: 'app-root',
  imports: [GridComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  sudoku = inject(SudokuService);
  
  async loadPuzzle(i: number) {
    this.sudoku.loadPuzzle(`puzzle${i}`);
  }

  solve() {
    this.sudoku.solve();
  }
}
