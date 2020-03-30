import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Point } from '../tools/line-tool.service';
import { DrawingTool, TOOL_INDEX } from '../tools/tool-manager.service';
import { Color, DrawElement, ERASING_COLOR_INIT } from './draw-element';

const DEFAULT_COLOR = 'rgba(0,0,0,1)';

@Injectable({
  providedIn: 'root'
})
export class LineService implements DrawElement {
  svg: string;
  svgHtml: SafeHtml;

  trueType: TOOL_INDEX;

  points: Point[];
  isSelected: boolean;
  erasingEvidence: boolean;

  primaryColor: Color;
  erasingColor: Color;

  thicknessLine: number;
  thicknessPoint: number;
  thickness: number;
  chosenOption: string;
  isAPolygon: boolean;
  mousePosition: Point;

  pointMin: Point;
  pointMax: Point;
  translate: Point;

  constructor() {
    this.svgHtml = '';
    this.trueType = TOOL_INDEX.LINE;
    this.points = [];
    this.isSelected = false;
    this.erasingEvidence = false;
    this.primaryColor = {
      RGBAString: DEFAULT_COLOR,
      RGBA: [0, 0, 0, 0]
    };
    this.erasingColor = ERASING_COLOR_INIT;
    this.isAPolygon = false;
    this.mousePosition = {x: 0, y: 0};
    this.translate = { x: 0, y: 0};
  }

  draw(): void {
    this.svg = (this.isAPolygon) ? '<polygon ' : '<polyline ';
    this.svg += 'transform="translate(' + this.translate.x + ' ' + this.translate.y + ')" ';
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
      this.svg += '<circle transform="translate(' + this.translate.x + ' ' + this.translate.y
      + ')" cx="' + point.x + '" cy="' + point.y + '" r="' + this.thicknessPoint
      + '" fill="' + ((this.erasingEvidence) ? this.erasingColor.RGBAString :  this.primaryColor.RGBAString) + '"></circle>';
    }
  }

  isEmpty(): boolean {
    return this.points.length === 0 ||
      (this.points.length === 1 && this.chosenOption === 'Sans points');
  }

  updatePosition(x: number, y: number): void {
    this.translate.x += x;
    this.translate.y += y;
    this.draw();
  }

  updatePositionMouse(mouse: MouseEvent, mouseClick: Point): void {
    this.translate.x = mouse.offsetX - mouseClick.x;
    this.translate.y = mouse.offsetY - mouseClick.y;
    this.draw();
  }

  updateParameters(tool: DrawingTool): void {
    this.thicknessLine = (tool.parameters[0].value) ? tool.parameters[0].value : 1;
    this.chosenOption = (tool.parameters[1].chosenOption) ? tool.parameters[1].chosenOption : '';
    this.thicknessPoint = (tool.parameters[2].value) ? tool.parameters[2].value : 1;
  }

  translateAllPoints(): void {
    for (const point of this.points) {
      point.x += this.translate.x;
      point.y += this.translate.y;
    }
    this.translate = {x: 0, y: 0};
  }
}
