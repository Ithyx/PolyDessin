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
    this.fill.primaryColor = this.colorParameter.primaryColor;
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
      this.image.onload = this.fillWithColor.bind(this);
      this.image.src = URL.createObjectURL(svg);
    }
  }

  // Algorithme basé sur http://www.programmersought.com/article/3670113928/
  fillWithColor(): void {
    this.context.drawImage(this.image, 0, 0);
    const pixelData = this.context.getImageData(this.mousePosition.x, this.mousePosition.y, 1, 1).data;
    this.color = [pixelData[0], pixelData[1], pixelData[2]];

    const queue: Point[] = [];
    queue.push(this.mousePosition);

    while (queue.length > 0) {
      const point = queue.pop();
      if (point) {
        let x1 = point.x;
        while (x1 > 0 && this.checkColor({x: x1, y: point.y})) {
          x1--;
        }
        x1++;
        this.fill.points.push({x: x1, y: point.y});
        let spanAbove = false;
        let spanBelow = false;
        while (x1 < this.drawing.clientWidth && this.checkColor({x: x1, y: point.y})) {
          if (!this.checkColor({x: x1, y: point.y - 1})) {
            spanAbove = false;
          } else if (!spanAbove && point.y > 0 ) {
            queue.push({x: x1, y: point.y - 1});
            spanAbove = true;
          }
          if (!this.checkColor({x: x1, y: point.y + 1})) {
            spanBelow = false;
          } else if (!spanBelow && point.y < this.drawing.clientHeight - 1) {
            queue.push({x: x1, y: point.y + 1});
            spanBelow = true;
          }
          const array = this.checkedPixels.get(x1);
          if (array) {
            array.push(this.getIndex({x: x1, y: point.y}));
          } else {
            this.checkedPixels.set(x1, [point.y]);
          }
          x1++;
        }
        this.fill.points.push({x: x1, y: point.y});
      }
    }

    this.fill.draw();
    this.commands.execute(new AddSVGService(this.fill, this.svgStockage));
  }

  checkColor(point: Point): boolean {
    // s'assurer de ne pas vérifier le même point deux fois
    const array = this.checkedPixels.get(point.x);
    if (array && array.includes(this.getIndex(point))) { return false; }
    const color = this.context.getImageData(point.x, point.y, 1, 1).data;
    const tolerance = (this.tools.activeTool.parameters[0].value) ? (this.tools.activeTool.parameters[0].value) : 0;
    const checkRedValue = Math.abs(this.color[R] - color[R]) <= (RGB_MAX * tolerance / PERCENTAGE);
    const checkGreenValue = Math.abs(this.color[G] - color[G]) <= (RGB_MAX * tolerance / PERCENTAGE);
    const checkBlueValue = Math.abs(this.color[B] - color[B]) <= (RGB_MAX * tolerance / PERCENTAGE);
    return checkRedValue && checkGreenValue && checkBlueValue;
  }

  // Attribue un index unique à chaque position du dessin
  getIndex(position: Point): number {
    return position.x + position.y * this.drawing.clientWidth;
  }
}
