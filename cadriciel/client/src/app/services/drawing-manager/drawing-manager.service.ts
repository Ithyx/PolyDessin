import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawingManagerService {
  height: number;
  width: number;

  constructor() {
    this.height = 500;
    this.width = 500;
  }
}
