import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Point } from '../tools/line-tool.service';
import { DrawingTool, EMPTY_TOOL } from '../tools/tool-manager.service';
import { DrawElement } from './draw-element';

@Injectable({
  providedIn: 'root'
})
export class PolygonService implements DrawElement {
  SVG: string;
  SVGHtml: SafeHtml;

  points: Point[];
  isSelected: boolean;

  primaryColor: string;
  secondaryColor: string;

  thickness: number;
  perimeter: string;

  tool: DrawingTool = EMPTY_TOOL;

  pointMin: Point;
  pointMax: Point;

  translate: Point;

  constructor() {
    this.SVGHtml = '';
    this.points = [];
    this.pointMin = {x: 0, y: 0};
    this.pointMax = {x: 0, y: 0};
    this.isSelected = false;
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
    const chosenOption = this.tool.parameters[1].chosenOption;
    this.SVG = '<polygon transform=" translate(' + this.translate.x + ' ' + this.translate.y +
      ')" fill="' + ((chosenOption !== 'Contour') ? this.primaryColor : 'none')
      + '" stroke="' + ((chosenOption !== 'Plein') ? this.secondaryColor : 'none')
      + '" stroke-width="' + this.tool.parameters[0].value
      + '" points="';
    for (const point of this.points) {
      this.SVG += point.x + ' ' + point.y + ' ';
    }
    this.SVG += '"/>';
  }

  drawPerimeter(): void {
    if (this.tool.parameters[1].chosenOption === 'Plein') {
      this.thickness = 0;
    } else if (this.tool.parameters[0].value) {
      this.thickness = this.tool.parameters[0].value;
    }
    this.perimeter = '<rect stroke="gray" fill="none" stroke-width="2';
    if (this.tool.parameters[1].chosenOption === 'Plein') {
      this.perimeter += '" x="' + this.pointMin.x + '" y="' + this.pointMin.y
        + '" height="' + this.getHeight() + '" width="' + this.getWidth() + '"/>';
    } else {
      this.perimeter += '" x="' + (this.pointMin.x - this.thickness / 2)
        + '" y="' + (this.pointMin.y - this.thickness / 2);
      this.perimeter += '" height="' + ((this.getHeight() === 0) ? this.thickness : (this.getHeight() + this.thickness))
        + '" width="' + ((this.getWidth() === 0) ? this.thickness : (this.getWidth() + this.thickness)) + '"/>';
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
}
