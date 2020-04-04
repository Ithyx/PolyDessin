import { Injectable } from '@angular/core';
import { Point } from '../stockage-svg/draw-element/draw-element';
import { ToolInterface } from './tool-interface';

@Injectable({
  providedIn: 'root'
})
export class PaintBucketToolService implements ToolInterface {

  drawing: SVGElement;
  canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private image: HTMLImageElement;
  private mousePosition: Point;

  constructor() {
    this.mousePosition = {x: 0, y: 0};
  }

  onMouseClick(mouse: MouseEvent): void {
    this.mousePosition = {x: mouse.offsetX, y: mouse.offsetY};
    this.createCanvas();
  }

  /* Conversion de svg vers canvas basée sur
     http://bl.ocks.org/biovisualize/8187844?fbclid=IwAR3_VuqkefCECFbFJ_0nQJuYe0qIx9NFzE0uY9W0UDytZDsPsEpB4QvnTYk */
  createCanvas(): void {
    const context = this.canvas.getContext('2d');
    if (this.drawing && context) {
      this.context = context;
      const svgString = new XMLSerializer().serializeToString(this.drawing);
      const svg = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
      this.image = new Image();
      this.image.onload = this.fillWithColor.bind(this);
      this.image.src = URL.createObjectURL(svg);
    }
  }

  fillWithColor(): void {
    this.context.drawImage(this.image, 0, 0);
    const pixelData = this.context.getImageData(this.mousePosition.x, this.mousePosition.y, 1, 1).data;
    const pixelColor = [pixelData[0], pixelData[1], pixelData[2]];
    console.log(pixelColor);
  }
}
