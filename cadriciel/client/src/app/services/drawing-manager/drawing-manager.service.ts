import { Injectable } from '@angular/core';
import { Color } from '../stockage-svg/draw-element';

const BUFFER_WIDTH = 535;
const BUFFER_HEIGHT = 4;
const INITIAL_HEIGHT = window.innerHeight - BUFFER_HEIGHT;
const INITIAL_WIDTH = window.innerWidth - BUFFER_WIDTH;

@Injectable({
  providedIn: 'root'
})

export class DrawingManagerService {
  height: number;
  width: number;
  id: number;
  name: string;
  backgroundColor: Color;
  tags: string[];

  constructor() {
    this.height = INITIAL_HEIGHT;
    this.width = INITIAL_WIDTH;
    this.id = 0;
    this.name = '';
    this.backgroundColor = {
      RGBAString: 'rgba(255, 255, 255, 1)',
      RGBA: [255, 255, 255, 1]
    };
    this.tags = [];
  }
}
