import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  showGrid = false;
  cellSize = 50;
  opacity = 1;

  increaseSize() {
    this.cellSize += 5;
  }

  decreaseSize() {
    this.cellSize -= 5;
  }
}
