import { Injectable } from '@angular/core';
import { Color } from '../../color/color';
import { DrawingTool, TOOL_INDEX } from '../../tools/tool-manager.service';
import { DrawElement, Point } from '../draw-element/draw-element';

@Injectable({
  providedIn: 'root'
})
export class LineService extends DrawElement {
  primaryColor: Color;

  thicknessLine: number;
  thicknessPoint: number;
  thickness: number;
  chosenOption: string;
  isAPolygon: boolean;
  mousePosition: Point;

  constructor() {
    super();
    this.trueType = TOOL_INDEX.LINE;
    this.primaryColor = {
      RGBAString: '',
      RGBA: [0, 0, 0, 0]
    };
    this.isAPolygon = false;
    this.mousePosition = {x: 0, y: 0};
  }

  draw(): void {
    this.svg = (this.isAPolygon) ? '<polygon ' : '<polyline ';
    this.svg += 'transform=" matrix(' + this.transform.a + ' ' + this.transform.b + ' ' + this.transform.c + ' '
                                        + this.transform.d + ' ' + this.transform.e + ' ' + this.transform.f + ')" ';
    this.svg += 'fill="none" stroke="' + ((this.erasingEvidence) ? this.erasingColor.RGBAString :  this.primaryColor.RGBAString);
    this.svg += '" stroke-width="' + this.thicknessLine;
    this.svg += '" points="';
    for (const point of this.points) {
      this.svg += point.x + ' ' + point.y + ' ';
    }
    if (!this.isAPolygon) {
      this.svg += this.mousePosition.x + ' ' + this.mousePosition.y;
    }
    this.svg += `"></${(this.isAPolygon) ? 'polygon' : 'polyline'}>`;
    if (this.chosenOption === 'Avec points') {
      this.thickness = this.thicknessLine;
      this.drawPoints();
    }
  }

  drawPoints(): void {
    if (this.thicknessPoint) {
      if (2 * this.thicknessPoint > this.thickness) {
        this.thickness = 2 * this.thicknessPoint;
      }
      this.thicknessPoint = this.thicknessPoint;
    }
    for (const point of this.points) {
      this.svg += '<circle transform=" matrix(' + this.transform.a + ' ' + this.transform.b + ' ' + this.transform.c + ' '
                                                + this.transform.d + ' ' + this.transform.e + ' ' + this.transform.f
      + ')" cx="' + point.x + '" cy="' + point.y + '" r="' + this.thicknessPoint
      + '" fill="' + ((this.erasingEvidence) ? this.erasingColor.RGBAString :  this.primaryColor.RGBAString) + '"></circle>';
    }
  }

  isEmpty(): boolean {
    return this.points.length === 0 ||
      (this.points.length === 1 && this.chosenOption === 'Sans points');
  }

  updateParameters(tool: DrawingTool): void {
    this.thicknessLine = (tool.parameters[0].value) ? tool.parameters[0].value : 1;
    this.chosenOption = (tool.parameters[1].chosenOption) ? tool.parameters[1].chosenOption : '';
    this.thicknessPoint = (tool.parameters[2].value) ? tool.parameters[2].value : 1;
  }
}
