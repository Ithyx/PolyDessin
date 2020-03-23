import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Point } from '../tools/line-tool.service';
import { DrawingTool } from '../tools/tool-manager.service';
import { Color, DrawElement, ERASING_COLOR_INIT} from './draw-element';

export const MIN_DIAMETER = 5;

@Injectable({
  providedIn: 'root'
})
export class TraceSprayService implements DrawElement {

  svg: string;
  svgHtml: SafeHtml;
  isSelected: boolean;
  erasingEvidence: boolean;

  diameter: number;
  points: Point[] = [];

  primaryColor: Color;
  erasingColor: Color;

  pointMin: Point;
  pointMax: Point;
  translate: Point;

  constructor() {
    this.svgHtml = '';
    this.isSelected = false;
    this.primaryColor = {
      RGBAString: '',
      RGBA: [0, 0, 0, 0]
    };
    this.erasingColor = ERASING_COLOR_INIT;
    this.erasingEvidence = false;
    this.translate = { x: 0, y: 0};
  }

  draw(): void {
    this.svg = '';
    for (const point of this.points) {
      this.svg += '<circle transform="translate(' + this.translate.x + ' ' + this.translate.y
      + `)" cx="${point.x}" cy="${point.y}" r="1" `
      + `fill="${(this.erasingEvidence) ? this.erasingColor.RGBAString :  this.primaryColor.RGBAString}"></circle>`;
    }
  }

  addPoint(mousePosition: Point): void {
    const position = Math.random() * (this.diameter ? this.diameter / 2 : 1);
    const angle = Math.random() * 2 * Math.PI;
    const x = mousePosition.x + position * Math.cos(angle);
    const y = mousePosition.y + position * Math.sin(angle);
    this.points.push({x, y});
    this.svg += '<circle transform="translate(' + this.translate.x + ' ' + this.translate.y
      + `)" cx="${x}" cy="${y}" r="1" `
      + `fill="${(this.erasingEvidence) ? this.erasingColor.RGBAString :  this.primaryColor.RGBAString}"></circle>`;
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
    this.diameter = (tool.parameters[0].value) ? tool.parameters[0].value : MIN_DIAMETER;
  }

  translateAllPoints(): void {
    for (const point of this.points) {
      point.x += this.translate.x;
      point.y += this.translate.y;
    }
    this.translate = {x: 0, y: 0};
  }
}
