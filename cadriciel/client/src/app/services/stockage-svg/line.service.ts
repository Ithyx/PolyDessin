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
  thickness: number;
  isAPolygon: boolean;
  mousePosition: Point;

  constructor() {
    this.points = [];
    this.isSelected = false;
    this.primaryColor = 'rgba(0,0,0,1)';
    this.tool = EMPTY_TOOL;
    this.isAPolygon = false;
    this.mousePosition = {x: 0, y: 0};
  }

  draw(): void {
    if (this.tool.parameters[0].value) {
      this.thickness = this.tool.parameters[0].value;
    }
    this.SVG = (this.isAPolygon) ? '<polygon ' : '<polyline ';
    this.SVG += 'fill="none" stroke="' + this.primaryColor + '" stroke-width="' + this.tool.parameters[0].value;
    this.SVG += '" points="';
    for (const point of this.points) {
      this.SVG += point.x + ' ' + point.y + ' ';
    }
    if (!this.isAPolygon) {
      this.SVG += this.mousePosition.x + ' ' + this.mousePosition.y;
    }
    this.SVG += '" />';
    if (this.tool.parameters[1].chosenOption === 'Avec points') {
      this.drawPoints();
    }
  }

  drawPoints(): void {
    if (this.tool.parameters[2].value) {
      if (2 * this.tool.parameters[2].value > this.thickness) {
        this.thickness = 2 * this.tool.parameters[2].value;
    }
  }
    for (const point of this.points) {
      this.SVG += ' <circle cx="' + point.x + '" cy="' + point.y + '" r="'
      + this.tool.parameters[2].value  + '" fill="' + this.primaryColor + '"/>';
    }
  }

  isEmpty(): boolean {
    return this.points.length === 0 ||
      (this.points.length === 1 && this.tool.parameters[1].chosenOption === 'Sans points');
  }
}
