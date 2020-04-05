import { Injectable } from '@angular/core';
import { ColorParameterService } from '../color/color-parameter.service';
import { AddSVGService } from '../command/add-svg.service';
import { CommandManagerService } from '../command/command-manager.service';
import { Point } from '../stockage-svg/draw-element/draw-element';
import { TracePencilService } from '../stockage-svg/draw-element/trace/trace-pencil.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { ToolInterface } from './tool-interface';

const PENCIL_THICKNESS = 3;

@Injectable({
  providedIn: 'root'
})
export class PaintBucketToolService implements ToolInterface {

  drawing: SVGElement;
  canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private image: HTMLImageElement;
  private mousePosition: Point;
  private fill: TracePencilService;
  private checkedPixels: number[]; // Map<number, number[]>;
  private color: [number, number, number];

  constructor(private colorParameter: ColorParameterService,
              private commands: CommandManagerService,
              private svgStockage: SVGStockageService) {
    this.fill = new TracePencilService();
    this.color = [0, 0, 0];
    this.mousePosition = {x: 0, y: 0};
    this.checkedPixels = []; // new Map<number, number[]>();
  }

  onMouseClick(mouse: MouseEvent): void {
    this.mousePosition = {x: mouse.offsetX, y: mouse.offsetY};
    this.fill = new TracePencilService();
    this.fill.points = [];
    this.fill.primaryColor = this.colorParameter.primaryColor;
    this.fill.thickness = PENCIL_THICKNESS;
    this.checkedPixels = []; // new Map<number, number[]>();
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
      this.image.onload = this.fillWithColor2.bind(this);
      this.image.src = URL.createObjectURL(svg);
    }
  }

  // http://www.programmersought.com/article/3670113928/
  fillWithColor2(): void {
    this.context.drawImage(this.image, 0, 0);
    const pixelData = this.context.getImageData(this.mousePosition.x, this.mousePosition.y, 1, 1).data;
    this.color = [pixelData[0], pixelData[1], pixelData[2]];

    const queue: Point[] = [];
    queue.push(this.mousePosition);

    while (queue.length > 0) {
      const point = queue.pop();
      if (point) {
        this.checkedPixels.push(this.getIndex(point));
        let x1 = point.x;
        let color = this.context.getImageData(point.x, point.y, 1, 1).data;
        while (x1 > 0 && this.checkColor(color)) {
          x1--;
          color = this.context.getImageData(x1, point.y, 1, 1).data;
        }
        x1++;
        this.fill.points.push({x: x1, y: point.y});
        let spanAbove = false;
        let spanBelow = false;
        color = this.context.getImageData(x1, point.y, 1, 1).data;
        while (x1 < this.drawing.clientWidth && this.checkColor(color)) {
            let testColor = this.context.getImageData(x1, point.y - 1, 1, 1).data;
            if (!spanAbove && point.y > 0 && this.checkColor(testColor)) {
              if (!this.checkedPixels.includes(this.getIndex({x: x1, y: point.y - 1}))) {
                queue.push({x: x1, y: point.y - 1});
              }
              spanAbove = true;
            }
            testColor = this.context.getImageData(x1, point.y + 1, 1, 1).data;
            if (!spanBelow && point.y < this.drawing.clientHeight && this.checkColor(testColor)) {
              if (!this.checkedPixels.includes(this.getIndex({x: x1, y: point.y + 1}))) {
                queue.push({x: x1, y: point.y + 1});
              }
              spanBelow = true;
            }
            x1++;
            color = this.context.getImageData(x1, point.y, 1, 1).data;
        }
        this.fill.points.push({x: x1, y: point.y});
      }
    }

    this.fill.draw();
    this.commands.execute(new AddSVGService(this.fill, this.svgStockage));
  }

  checkColor(color: Uint8ClampedArray): boolean {
    return color[0] === this.color[0] && color[1] === this.color[1] && color[2] === this.color[2];
  }

  checkPixel(position: Point): boolean {
    const pixelData = this.context.getImageData(position.x, position.y, 1, 1).data;
    return (position.x >= 0 && position.x < this.drawing.clientWidth)
      && (position.y >= 0 && position.y < this.drawing.clientHeight)
      && (pixelData[0] === this.color[0] && pixelData[1] === this.color[1] && pixelData[2] === this.color[1]);
  }

  // Attribue un index unique à chaque position du dessin
  getIndex(position: Point): number {
    return position.x + position.y * this.drawing.clientWidth;
  }
}
