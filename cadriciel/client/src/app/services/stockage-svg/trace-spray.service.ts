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
  isSelected = false;

  tool: DrawingTool = EMPTY_TOOL;
  points: Point[] = [];

  primaryColor: string;

  draw() {
    this.SVG = '';
    for (const point of this.points) {
      this.SVG += `<circle cx="${point.x}" cy="${point.y}" r="2" fill="black" />`;
    }
  }
}
