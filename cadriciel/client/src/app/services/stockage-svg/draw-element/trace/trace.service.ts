import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Color } from 'src/app/services/color/color';
import { DrawingTool, TOOL_INDEX } from 'src/app/services/tools/tool-manager.service';
import { DrawElement, ERASING_COLOR_INIT, Point } from '../../draw-element/draw-element';

@Injectable({
  providedIn: 'root'
})
export abstract class TraceService implements DrawElement {
  svg: string;
  svgHtml: SafeHtml;

  trueType: TOOL_INDEX;

  points: Point[];
  // isSelected: boolean;
  erasingEvidence: boolean;

  primaryColor: Color;
  erasingColor: Color;

  thickness: number;

  isAPoint: boolean;

  pointMin: Point;
  pointMax: Point;

  translate: Point;

  constructor() {
    this.svgHtml = '';
    this.points = [];
    // this.isSelected = false;
    this.primaryColor = {
      RGBAString: '',
      RGBA: [0, 0, 0, 0]
    };
    this.erasingColor = ERASING_COLOR_INIT;
    this.erasingEvidence = false;
    this.isAPoint = false;
    this.pointMin = {x: 0 , y: 0};
    this.pointMax = {x: 0 , y: 0};
    this.translate = { x: 0, y: 0};
  }

  draw(): void {
    if (this.isAPoint) {
      this.drawPoint();
    } else {
      this.drawPath();
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

  abstract drawPath(): void;
  abstract drawPoint(): void;
  abstract updateParameters(tool: DrawingTool): void;
}
