import { Injectable } from '@angular/core';
import { RGB_MAX, R, G, B } from '../color/color';
import { PERCENTAGE } from '../color/color-manager.service';
import { ColorParameterService } from '../color/color-parameter.service';
import { AddSVGService } from '../command/add-svg.service';
import { CommandManagerService } from '../command/command-manager.service';
import { Point } from '../stockage-svg/draw-element/draw-element';
import { TracePencilService } from '../stockage-svg/draw-element/trace/trace-pencil.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { ToolInterface } from './tool-interface';
import { ToolManagerService } from './tool-manager.service';

const PENCIL_THICKNESS = 2;

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
  private checkedPixels: number[];
  private color: [number, number, number];

  constructor(private colorParameter: ColorParameterService,
              private commands: CommandManagerService,
              private svgStockage: SVGStockageService,
              private tools: ToolManagerService) {
    this.fill = new TracePencilService();
    this.color = [0, 0, 0];
    this.mousePosition = {x: 0, y: 0};
    this.checkedPixels = [];
  }

  onMouseClick(mouse: MouseEvent): void {
    this.mousePosition = {x: mouse.offsetX, y: mouse.offsetY};
    this.fill = new TracePencilService();
    this.fill.points = [];
    this.fill.primaryColor = this.colorParameter.primaryColor;
    this.fill.thickness = PENCIL_THICKNESS;
    this.checkedPixels = [];
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
      // s'assurer de ne pas vérifier le même point deux fois
      if (point && !this.checkedPixels.includes(this.getIndex(point))) {
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
              queue.push({x: x1, y: point.y - 1});
              spanAbove = true;
            }
            testColor = this.context.getImageData(x1, point.y + 1, 1, 1).data;
            if (!spanBelow && point.y < this.drawing.clientHeight - 1 && this.checkColor(testColor)) {
              queue.push({x: x1, y: point.y + 1});
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
