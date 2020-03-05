import { Injectable } from '@angular/core';

const INITIAL_HEIGHT = 500;
const INITIAL_WIDTH = 500;

@Injectable({
  providedIn: 'root'
})

export class DrawingManagerService {
  height: number;
  width: number;
  id: number;
  name: string;
  backgroundColor: string;
  tags: string[];

  constructor() {
    this.height = INITIAL_HEIGHT;
    this.width = INITIAL_WIDTH;
    this.id = 0;
    this.name = '';
    this.backgroundColor = 'rgba(255, 255, 255, 1)';
    this.tags = [];
  }
}
