import { Component } from '@angular/core';

@Component({
  selector: 'sudoku-cell',
  imports: [],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.scss'
})
export class CellComponent {
  value: number | null = 9;
}
