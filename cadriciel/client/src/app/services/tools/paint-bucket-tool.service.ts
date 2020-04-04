import { Injectable } from '@angular/core';
import { ColorParameterService } from '../color/color-parameter.service';
import { AddSVGService } from '../command/add-svg.service';
import { CommandManagerService } from '../command/command-manager.service';
import { PolygonService } from '../stockage-svg/draw-element/basic-shape/polygon.service';
import { Point } from '../stockage-svg/draw-element/draw-element';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { ToolInterface } from './tool-interface';

// Constantes représentant les possibilités de points contigus au point courant
const row = [ -1, -1, -1,  0,  0,  1,  1,  1 ];
const col = [ -1,  0,  1, -1,  1, -1,  0,  1 ];

@Injectable({
  providedIn: 'root'
})
export class PaintBucketToolService implements ToolInterface {

  drawing: SVGElement;
  canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private image: HTMLImageElement;
  private mousePosition: Point;
  private fill: PolygonService;
  private checkedPixels: number[];
  private color: [number, number, number];

  constructor(private colorParameter: ColorParameterService,
              private commands: CommandManagerService,
              private svgStockage: SVGStockageService) {
    this.fill = new PolygonService();
    this.color = [0, 0, 0];
    this.mousePosition = {x: 0, y: 0};
    this.checkedPixels = [];
  }

  onMouseClick(mouse: MouseEvent): void {
    this.mousePosition = {x: mouse.offsetX, y: mouse.offsetY};
    this.fill = new PolygonService();
    this.fill.chosenOption = 'Plein';
    this.fill.points = [];
    this.fill.primaryColor = this.colorParameter.primaryColor;
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

  // algorithme basé sur : https://www.techiedelight.com/flood-fill-algorithm/
  fillWithColor(): void {
    this.context.drawImage(this.image, 0, 0);
    const pixelData = this.context.getImageData(this.mousePosition.x, this.mousePosition.y, 1, 1).data;
    this.color = [pixelData[0], pixelData[1], pixelData[2]];
    const queue: Point[] = [];
    queue.push(this.mousePosition);

    while (queue.length > 0) {
      const point = queue.pop();
      if (point) {
        this.checkedPixels.push(this.getIndex(point));
        for (let i = 0; i < row.length; i++) {
          const testPoint = {x: point.x + row[i], y: point.y + col[i]};
          if (this.checkPixel(testPoint)) {
            if (!this.checkedPixels.includes(this.getIndex(testPoint))) {
              queue.push(testPoint);
            }
          } else {
            this.fill.points.push({...point});
          }
        }
      }
    }

    this.fill.draw();
    this.commands.execute(new AddSVGService(this.fill, this.svgStockage));
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
