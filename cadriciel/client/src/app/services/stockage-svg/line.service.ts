import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Point } from '../tools/line-tool.service';
import { DrawingTool, EMPTY_TOOL } from '../tools/tool-manager.service';
import { DrawElement } from './draw-element';

@Injectable({
  providedIn: 'root'
})
export class LineService implements DrawElement {
  SVG: string;
  SVGHtml: SafeHtml;

  points: Point[];
  isSelected: boolean;

  primaryColor: string;

  tool: DrawingTool;
  thicknessLine: number;
  thicknessPoint: number;           // REFACTORING
  thickness: number;
  chosenOption: string;
  isAPolygon: boolean;
  mousePosition: Point;

  pointMin: Point;
  pointMax: Point;
  translate: Point;

  constructor() {
    this.SVGHtml = '';
    this.points = [];
    this.isSelected = false;
    this.primaryColor = 'rgba(0,0,0,1)';
    this.tool = EMPTY_TOOL;
    this.isAPolygon = false;
    this.mousePosition = {x: 0, y: 0};
    this.translate = { x: 0, y: 0};
  }

  draw(): void {
    if (!this.isSelected) {
      this.thicknessLine = (this.tool.parameters[0].value) ? this.tool.parameters[0].value : 1;
      this.chosenOption = (this.tool.parameters[1].chosenOption) ? this.tool.parameters[1].chosenOption : '';
    }

    this.SVG = (this.isAPolygon) ? '<polygon ' : '<polyline ';
    this.SVG += ' transform ="translate(' + this.translate.x + ' ' + this.translate.y + ')"';
    this.SVG += 'fill="none" stroke="' + this.primaryColor + '" stroke-width="' + this.thicknessLine;
    this.SVG += '" points="';
    for (const point of this.points) {
      this.SVG += point.x + ' ' + point.y + ' ';
    }
    if (!this.isAPolygon) {
      this.SVG += this.mousePosition.x + ' ' + this.mousePosition.y;
    }
    this.SVG += '" />';
    if (this.chosenOption === 'Avec points') {
      this.thickness = this.thicknessLine;
      this.drawPoints();
    }
  }

  drawPoints(): void {
    if (this.tool.parameters[2].value && !this.isSelected) {
      if (2 * this.tool.parameters[2].value > this.thickness) {
        this.thickness = 2 * this.tool.parameters[2].value;
      }
      this.thicknessPoint = this.tool.parameters[2].value;
    }
    for (const point of this.points) {
      this.SVG += '<circle transform ="translate(' + this.translate.x + ' ' + this.translate.y
      + ')"cx="' + point.x + '" cy="' + point.y + '" r="' + this.thicknessPoint  + '" fill="' + this.primaryColor + '"/>';
    }
  }

  isEmpty(): boolean {
    return this.points.length === 0 ||
      (this.points.length === 1 && this.tool.parameters[1].chosenOption === 'Sans points');
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
