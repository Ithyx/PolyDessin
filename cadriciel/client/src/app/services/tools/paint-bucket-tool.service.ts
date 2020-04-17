import { Injectable } from '@angular/core';
import { B, G, R, RGB_MAX } from '../color/color';
import { PERCENTAGE } from '../color/color-manager.service';
import { ColorParameterService } from '../color/color-parameter.service';
import { AddSVGService } from '../command/add-svg.service';
import { CommandManagerService } from '../command/command-manager.service';
import { ColorFillService } from '../stockage-svg/draw-element/color-fill.service';
import { Point } from '../stockage-svg/draw-element/draw-element';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { ToolInterface } from './tool-interface';
import { ToolManagerService } from './tool-manager.service';

const RGBA_COUNT = 4;

@Injectable({
  providedIn: 'root'
})
export class PaintBucketToolService implements ToolInterface {

  drawing: SVGElement;
  canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private image: HTMLImageElement;
  private mousePosition: Point;
  private fill: ColorFillService;
  private checkedPixels: Map<number, number[]>;
  private color: [number, number, number];
  private pixelData: Uint8ClampedArray;

  constructor(private colorParameter: ColorParameterService,
              private commands: CommandManagerService,
              private svgStockage: SVGStockageService,
              private tools: ToolManagerService) {
    this.fill = new ColorFillService();
    this.color = [0, 0, 0];
    this.mousePosition = {x: 0, y: 0};
    this.checkedPixels = new Map<number, number[]>();
  }

  onMouseClick(mouse: MouseEvent): void {
    this.mousePosition = {x: mouse.offsetX, y: mouse.offsetY};
    this.fill = new ColorFillService();
    this.fill.points = [];
    this.fill.primaryColor = {...this.colorParameter.primaryColor};
    this.checkedPixels = new Map<number, number[]>();
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
      this.image.onload = this.onImageLoad.bind(this);
      this.image.src = URL.createObjectURL(svg);
    }
  }

  onImageLoad(): void {
    console.log(this.image);
    this.context.drawImage(this.image, 0, 0);
    this.pixelData = this.context.getImageData(0, 0, this.drawing.clientWidth, this.drawing.clientHeight).data;
    const pixelIndex = this.getIndex(this.mousePosition);
    this.color = [this.pixelData[pixelIndex], this.pixelData[pixelIndex + 1], this.pixelData[pixelIndex + 2]];
    const primaryColor = this.colorParameter.primaryColor.RGBA;
    if (this.color[0] === primaryColor[0] && this.color[1] === primaryColor[1] && this.color[2] === primaryColor[2]) {
      return;
    }

    this.fillWithColor();

    if (this.fill.points.length > 0) {
      this.fill.draw();
      this.commands.execute(new AddSVGService([this.fill], this.svgStockage));
    }
  }

  // Algorithme basé sur http://www.programmersought.com/article/3670113928/
  fillWithColor(): void {
    const queue: Point[] = [];
    queue.push(this.mousePosition);

    while (queue.length > 0) {
      const point = queue.pop();
      if (point) {
        let xPosition = this.findLeftBorder(point);
        let spanAbove = false;
        let spanBelow = false;
        while (xPosition < this.drawing.clientWidth && this.checkColor({x: xPosition, y: point.y})) {
          spanAbove = this.checkAbovePixel({x: xPosition, y: point.y}, spanAbove, queue);
          spanBelow = this.checkBelowPixel({x: xPosition, y: point.y}, spanBelow, queue);
          this.addPixelPosition({x: xPosition, y: point.y});
          xPosition++;
        }
        this.fill.points.push({x: xPosition, y: point.y});
      }
    }
  }

  findLeftBorder(point: Point): number {
    let xPosition = point.x;
    while (xPosition >= 0 && this.checkColor({x: xPosition, y: point.y})) {
      xPosition--;
    }
    xPosition++;
    this.fill.points.push({x: xPosition, y: point.y});
    return xPosition;
  }

  checkAbovePixel(position: Point, spanAbove: boolean, queue: Point[]): boolean {
    if (!this.checkColor({x: position.x, y: position.y - 1})) {
      return false;
    } else if (!spanAbove && position.y > 0 ) {
      queue.push({x: position.x, y: position.y - 1});
      return true;
    }
    return spanAbove;
  }

  checkBelowPixel(position: Point, spanBelow: boolean, queue: Point[]): boolean {
    if (!this.checkColor({x: position.x, y: position.y + 1})) {
      return false;
    } else if (!spanBelow && position.y < this.drawing.clientHeight - 1) {
      queue.push({x: position.x, y: position.y + 1});
      return true;
    }
    return spanBelow;
  }

  addPixelPosition(position: Point): void {
    const array = this.checkedPixels.get(position.x);
    if (array) {
      array.push(position.y);
    } else {
      this.checkedPixels.set(position.x, [position.y]);
    }
  }

  checkColor(point: Point): boolean {
    // s'assurer de ne pas vérifier le même point deux fois
    const array = this.checkedPixels.get(point.x);
    if (array && array.includes(point.y)) { return false; }
    const pixelIndex = this.getIndex(point);
    const tolerance = (this.tools.activeTool.parameters[0].value) ?
      (RGB_MAX * this.tools.activeTool.parameters[0].value / PERCENTAGE) : 0;
    const checkRedValue = Math.abs(this.color[R] - this.pixelData[pixelIndex]) <= tolerance;
    const checkGreenValue = Math.abs(this.color[G] - this.pixelData[pixelIndex + 1]) <= tolerance;
    const checkBlueValue = Math.abs(this.color[B] - this.pixelData[pixelIndex + 2]) <= tolerance;
    return checkRedValue && checkGreenValue && checkBlueValue;
  }

  // Attribue un index unique à chaque position du dessin
  getIndex(position: Point): number {
    return (position.x + position.y * this.drawing.clientWidth) * RGBA_COUNT;
  }
}
