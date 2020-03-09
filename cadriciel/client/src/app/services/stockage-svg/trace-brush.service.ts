import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Point } from '../tools/line-tool.service';
import { DrawingTool } from '../tools/tool-manager.service';
import { DrawElement } from './draw-element';

@Injectable({
  providedIn: 'root'
})
export class TraceBrushService implements DrawElement {
  svg: string;
  svgHtml: SafeHtml;

  points: Point[];
  isSelected: boolean;

  isAPoint: boolean;
  thickness: number;
  chosenOption: string;
  primaryColor: string;

  pointMin: Point;
  pointMax: Point;
  translate: Point;

  constructor() {
    this.svgHtml = '';
    this.points = [];
    this.isSelected = false;
    this.isAPoint = false;
    this.translate = { x: 0, y: 0};
  }

  draw(): void {
    if (this.isAPoint) {
      this.drawPoint();
    } else {
      this.drawPath();
    }
  }

  drawPath(): void {
    this.svg = '<path transform ="translate(' + this.translate.x + ' ' + this.translate.y + `)" fill="none" stroke="${this.primaryColor}"`
      + ' filter="url(#' + this.chosenOption
      + ')" stroke-linecap="round" stroke-width="' + this.thickness + '" d="';
    for (let i = 0; i < this.points.length; ++i) {
      this.svg += (i === 0) ? 'M ' : 'L ';
      this.svg += this.points[i].x + ' ' + this.points[i].y + ' ';
    }
    this.svg += '" />';
  }

  drawPoint(): void {
    this.svg = '<circle cx="' + this.points[0].x + '" cy="' + this.points[0].y
      + '" filter="url(#' + this.chosenOption
      + ')" r="' + this.thickness / 2
      + '" fill="' + this.primaryColor + '"/>';
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

  updateParameters(tool: DrawingTool): void {
    this.thickness = (tool.parameters[0].value) ? tool.parameters[0].value : 1;
    this.chosenOption = (tool.parameters[1].chosenOption) ? tool.parameters[1].chosenOption : '';
  }
}
