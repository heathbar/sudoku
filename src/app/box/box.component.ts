import { Component } from '@angular/core';
import { CellComponent } from '../cell/cell.component';

@Component({
  selector: 'sudoku-box',
  imports: [CellComponent],
  templateUrl: './box.component.html',
  styleUrl: './box.component.scss'
})
export class BoxComponent {

}
