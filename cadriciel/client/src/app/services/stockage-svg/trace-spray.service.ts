import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Point } from '../tools/line-tool.service';
import { DrawingTool, EMPTY_TOOL } from '../tools/tool-manager.service';
import { DrawElement } from './draw-element';

@Injectable({
  providedIn: 'root'
})
export class TraceSprayService implements DrawElement {

  SVG: string;
  SVGHtml: SafeHtml;
  isSelected: boolean;

  tool: DrawingTool = EMPTY_TOOL;
  points: Point[] = [];

  primaryColor: string;

  pointMin: Point;
  pointMax: Point;

  constructor() {
    this.isSelected = false;
  }

  draw(): void {
    this.SVG = '';
    for (const point of this.points) {
      this.SVG += `<circle cx="${point.x}" cy="${point.y}" r="1" fill="${this.primaryColor}" />`;
    }
  }

  addPoint(mousePosition: Point): void {
    const diameter = this.tool.parameters[0].value;
    const position = Math.random() * (diameter ? diameter / 2 : 1);
    const angle = Math.random() * 2 * Math.PI;
    const x = mousePosition.x + position * Math.cos(angle);
    const y = mousePosition.y + position * Math.sin(angle);
    this.points.push({x, y});
    this.SVG += `<circle cx="${x}" cy="${y}" r="1" fill="${this.primaryColor}" />`;
  }
}
