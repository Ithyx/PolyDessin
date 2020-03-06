import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Point } from '../tools/line-tool.service';
import { DrawingTool, EMPTY_TOOL } from '../tools/tool-manager.service';
import { DrawElement } from './draw-element';


@Injectable({
  providedIn: 'root'
})
export class EllipseService implements DrawElement {

  SVG: string;
  SVGHtml: SafeHtml;

  points: Point[];
  isSelected: boolean;

  primaryColor: string;
  secondaryColor: string;

  thickness: number;
  perimeter: string;
  isDotted: boolean;

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

  getRadius(): number {
    return (this.pointMax.x - this.pointMin.x) / 2;
  }

  draw(): void {
    this.drawEllipse();
    this.drawPerimeter();
  }

  drawEllipse(): void {
    const choosedOption = this.tool.parameters[1].chosenOption;
    this.SVG = '<ellipse transform=" translate(' + this.translate.x + ' ' + this.translate.y +
      ')" fill="' + ((choosedOption !== 'Contour') ? this.primaryColor : 'none')
      + '" stroke="' + ((choosedOption !== 'Plein') ? this.secondaryColor : 'none')
      + (this.isDotted ? '"stroke-dasharray="4, 4"'  : '')
      + '" stroke-width="' + this.tool.parameters[0].value
      + '" cx="' + this.points[0].x + '" cy="' + this.points[0].y
      + '" r="' + this.getRadius() + '"/>';
  }

  drawPerimeter(): void {
    if (this.tool.parameters[1].chosenOption === 'Plein') {
      this.thickness = 0;
    } else if (this.tool.parameters[0].value) {
      this.thickness = this.tool.parameters[0].value;
    }
    this.perimeter = '<ellipse stroke="gray" fill="none" stroke-width="2';
    if (this.tool.parameters[1].chosenOption === 'Plein') {
      this.perimeter += '" cx="' + this.pointMin.x + '" cy="' + this.pointMin.y
        + '" r="' + this.getRadius() + '"/>';
    } else {
      this.perimeter += '" cx="' + (this.pointMin.x - this.thickness / 2)
        + '" cy="' + (this.pointMin.y - this.thickness / 2);
      this.perimeter += '" rx="' + ((this.getRadius() === 0) ? this.thickness : (this.getRadius() + this.thickness)) + '"/>';
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

  translateAllPoints(): void {
    for (const point of this.points) {
      point.x += this.translate.x;
      point.y += this.translate.y;
    }
    this.translate = {x: 0, y: 0};
  }
}
