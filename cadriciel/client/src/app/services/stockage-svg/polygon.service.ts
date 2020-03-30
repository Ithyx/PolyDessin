import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Point } from '../tools/line-tool.service';
import { DrawingTool, TOOL_INDEX } from '../tools/tool-manager.service';
import { Color, DrawElement, ERASING_COLOR_INIT } from './draw-element';

@Injectable({
  providedIn: 'root'
})
export class PolygonService implements DrawElement {
  svg: string;
  svgHtml: SafeHtml;

  trueType: TOOL_INDEX;

  points: Point[];
  isSelected: boolean;
  erasingEvidence: boolean;

  primaryColor: Color;
  secondaryColor: Color;
  erasingColor: Color;

  thickness: number;
  chosenOption: string;
  perimeter: string;

  pointMin: Point;
  pointMax: Point;

  translate: Point;

  constructor() {
    this.svgHtml = '';
    this.trueType = TOOL_INDEX.POLYGON;
    this.points = [];
    this.primaryColor = {
      RGBAString: '',
      RGBA: [0, 0, 0, 0]
    };
    this.secondaryColor = {
      RGBAString: '',
      RGBA: [0, 0, 0, 0]
    };
    this.erasingColor = ERASING_COLOR_INIT;
    this.pointMin = {x: 0, y: 0};
    this.pointMax = {x: 0, y: 0};
    this.isSelected = false;
    this.erasingEvidence = false;
    this.translate = { x: 0, y: 0};
  }

  getWidth(): number {
    return this.pointMax.x - this.pointMin.x;
  }

  getHeight(): number {
    return this.pointMax.y - this.pointMin.y;
  }

  draw(): void {
    this.drawPolygon();
    this.drawPerimeter();
  }

  drawPolygon(): void {
    this.svg = '<polygon transform=" translate(' + this.translate.x + ' ' + this.translate.y +
      ')" fill="' + ((this.chosenOption !== 'Contour') ? this.primaryColor.RGBAString : 'none') + '" stroke="'
      + ((this.erasingEvidence) ? this.erasingColor.RGBAString :
        ((this.chosenOption !== 'Plein') ? this.secondaryColor.RGBAString : 'none'))
      + '" stroke-width="' + this.thickness
      + '" points="';
    for (const point of this.points) {
      this.svg += point.x + ' ' + point.y + ' ';
    }
    this.svg += '"></polygon>';
  }

  drawPerimeter(): void {
    this.perimeter = '<rect stroke="gray" fill="none" stroke-width="2';
    if (this.chosenOption === 'Plein') {
      this.perimeter += '" x="' + this.pointMin.x + '" y="' + this.pointMin.y
        + '" height="' + this.getHeight() + '" width="' + this.getWidth() + '"/>';
    } else {
      this.perimeter += '" x="' + (this.pointMin.x - this.thickness / 2)
        + '" y="' + (this.pointMin.y - this.thickness / 2);
      this.perimeter += '" height="' + (this.getHeight() + this.thickness)
        + '" width="' + (this.getWidth() + this.thickness) + '"/>';
    }
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
    this.thickness = (tool.parameters[0].value) ? tool.parameters[0].value : 1;
    this.chosenOption = (tool.parameters[1].chosenOption) ? tool.parameters[1].chosenOption : '';
  }

  translateAllPoints(): void {
    for (const point of this.points) {
      point.x += this.translate.x;
      point.y += this.translate.y;
    }
    this.translate = {x: 0, y: 0};
  }
}
