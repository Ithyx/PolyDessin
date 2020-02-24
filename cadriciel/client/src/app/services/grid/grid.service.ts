import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  showGrid = false;
  cellSize = 50;
  opacity = 0.75;

  increaseSize() {
    this.cellSize += 5 - (this.cellSize % 5);
  }

  decreaseSize() {
    this.cellSize -= this.cellSize % 5;
  }

  getColor(): string  {
    return 'rgba(0, 0, 0, ' + this.opacity + ')';
  }
}
