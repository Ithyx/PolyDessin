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
      this.SVG += '<circle transform ="translate(' + this.translate.x + ' ' + this.translate.y
      + `)"cx="${point.x}" cy="${point.y}" r="2" fill="black" />`;
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
