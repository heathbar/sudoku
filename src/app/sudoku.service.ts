import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { GridService } from './grid.service';
import { SolverService } from './solver.service';

@Injectable({
  providedIn: 'root'
})
export class SudokuService {

  http = inject(HttpClient);
  grid = inject(GridService);
  solver = inject(SolverService);

  constructor() { }

  async loadPuzzle(name: string) {
    const puzzle: any = await firstValueFrom(this.http.get(`${name}.json`));
    this.grid.load(puzzle.puzzle);


    console.log(this.grid.getRow(3));
    return puzzle.puzzle;
  }

  solve() {
    this.solver.solve();
  }
}
