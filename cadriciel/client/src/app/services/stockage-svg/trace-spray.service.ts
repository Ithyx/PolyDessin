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

  tool: DrawingTool;
  points: Point[] = [];

  primaryColor: string;

  pointMin: Point;
  pointMax: Point;
  translate: Point;

  constructor() {
    this.SVGHtml = '';
    this.isSelected = false;
    this.tool = EMPTY_TOOL;
    this.translate = { x: 0, y: 0};
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
    this.SVG += '<circle transform ="translate(' + this.translate.x + ' ' + this.translate.y
      + `)"cx="${x}" cy="${y}" r="1" fill="${this.primaryColor}" />`;
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
