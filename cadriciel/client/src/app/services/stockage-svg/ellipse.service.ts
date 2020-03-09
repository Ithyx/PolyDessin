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

  tool: DrawingTool = EMPTY_TOOL;

  pointMin: Point;
  pointMax: Point;
  translate: Point;

  constructor() {
    this.SVGHtml = '';
    this.points = [{x: 0, y: 0},    // points[0], coin haut gauche (base)
                   {x: 0, y: 0}];   // points[1], coin bas droite
    this.pointMin = {x: 0, y: 0};
    this.pointMax = {x: 0, y: 0};
    this.isSelected = false;
    this.translate = { x: 0, y: 0};
  }

  getWidth(): number {
    return Math.abs(this.points[1].x - this.points[0].x);
  }

  getHeight(): number {
    return Math.abs(this.points[1].y - this.points[0].y);
  }

  draw(): void {
    if ((this.getWidth() === 0 || this.getHeight() === 0)
      && this.tool.parameters[1].chosenOption !== 'Plein') {
      this.drawLine();
    } else {
      this.drawEllipse();
    }
    this.drawPerimeter();
  }

  drawLine(): void {
    if (this.tool.parameters[0].value) {
      this.thickness = this.tool.parameters[0].value;
    }

    this.SVG = '<line stroke-linecap="round'
      + '" stroke="' + this.secondaryColor
      + '" stroke-width="' + this.tool.parameters[0].value
      + '" x1="' + this.points[0].x + '" y1="' + this.points[0].y
      + '" x2="' + (this.points[0].x + this.getWidth())
      + '" y2="' + (this.points[0].y + this.getHeight()) + '"/>';
  }

  drawEllipse(): void {
    const choosedOption = this.tool.parameters[1].chosenOption;
    this.SVG = '<ellipse transform=" translate(' + this.translate.x + ' ' + this.translate.y +
      ')" fill="' + ((choosedOption !== 'Contour') ? this.primaryColor : 'none')
      + '" stroke="' + ((choosedOption !== 'Plein') ? this.secondaryColor : 'none')
      + '" stroke-width="' + this.tool.parameters[0].value
      + '" cx="' + (this.points[0].x + this.points[1].x) / 2 + '" cy="' + (this.points[0].y + this.points[1].y) / 2
      + '" rx="' + this.getWidth() / 2 + '" ry="' + this.getHeight() / 2 + '"/>';
  }

  drawPerimeter(): void {
    if (this.tool.parameters[1].chosenOption === 'Plein') {
      this.thickness = 0;
    } else if (this.tool.parameters[0].value) {
      this.thickness = this.tool.parameters[0].value;
    }
    const thickness = (this.tool.parameters[0].value) ? this.tool.parameters[0].value : 0;
    this.perimeter = '<rect stroke="gray" fill="none" stroke-width="2';
    if (this.tool.parameters[1].chosenOption === 'Plein') {
      this.perimeter += '" x="' + this.points[0].x + '" y="' + this.points[0].y
        + '" height="' + this.getHeight() + '" width="' + this.getWidth() + '"/>';
    } else {
      this.perimeter += '" x="' + (this.points[0].x - thickness / 2)
        + '" y="' + (this.points[0].y - thickness / 2);
      this.perimeter += '" height="' + ((this.getHeight() === 0) ? thickness : (this.getHeight() + thickness))
        + '" width="' + ((this.getWidth() === 0) ? thickness : (this.getWidth() + thickness)) + '"/>';
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
