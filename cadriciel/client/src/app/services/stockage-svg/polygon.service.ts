import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Point } from '../tools/line-tool.service';
import { DrawingTool } from '../tools/tool-manager.service';
import { DrawElement } from './draw-element';

const MIN_SIDES = 4;

@Injectable({
  providedIn: 'root'
})
export class PolygonService implements DrawElement {
  svg: string;
  svgHtml: SafeHtml;

  points: Point[];
  isSelected: boolean;

  primaryColor: string;
  secondaryColor: string;

  thickness: number;
  chosenOption: string;
  sides: number;
  perimeter: string;

  pointMin: Point;
  pointMax: Point;

  translate: Point;

  constructor() {
    this.svgHtml = '';
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
    this.svg = '<polygon transform=" translate(' + this.translate.x + ' ' + this.translate.y +
      ')" fill="' + ((this.chosenOption !== 'Contour') ? this.primaryColor : 'none')
      + '" stroke="' + ((this.chosenOption !== 'Plein') ? this.secondaryColor : 'none')
      + '" stroke-width="' + this.thickness
      + '" points="';
    for (const point of this.points) {
      this.svg += point.x + ' ' + point.y + ' ';
    }
    this.svg += '"></polygon>';
  }

  drawPerimeter(): void {
    const thickness = (this.chosenOption === 'Plein') ? 0 : this.thickness;
    this.perimeter = '<rect stroke="gray" fill="none" stroke-width="2';
    if (this.chosenOption === 'Plein') {
      this.perimeter += '" x="' + this.pointMin.x + '" y="' + this.pointMin.y
        + '" height="' + this.getHeight() + '" width="' + this.getWidth() + '"/>';
    } else {
      this.perimeter += '" x="' + (this.pointMin.x - thickness / 2)
        + '" y="' + (this.pointMin.y - thickness / 2);
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

  updateParameters(tool: DrawingTool): void {
    this.thickness = (tool.parameters[0].value) ? tool.parameters[0].value : 1;
    this.chosenOption = (tool.parameters[1].chosenOption) ? tool.parameters[1].chosenOption : '';
    this.sides = (tool.parameters[2].value) ? tool.parameters[2].value : MIN_SIDES;
  }

  translateAllPoints(): void {
    for (const point of this.points) {
      point.x += this.translate.x;
      point.y += this.translate.y;
    }
    this.translate = {x: 0, y: 0};
  }
}
