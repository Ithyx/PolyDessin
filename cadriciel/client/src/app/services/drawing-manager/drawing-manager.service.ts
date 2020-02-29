import { Injectable } from '@angular/core';

const INITIAL_HEIGHT = 500;
const INITIAL_WIDTH = 500;

@Injectable({
  providedIn: 'root'
})

export class DrawingManagerService {
  height: number;
  width: number;

  constructor() {
    this.height = INITIAL_HEIGHT;
    this.width = INITIAL_WIDTH;
  }
}
