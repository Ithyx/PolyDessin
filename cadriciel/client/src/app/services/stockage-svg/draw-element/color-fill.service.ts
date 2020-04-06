import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Color } from '../../color/color';
import { TOOL_INDEX } from '../../tools/tool-manager.service';
import { DrawElement, ERASING_COLOR_INIT, Point } from './draw-element';

@Injectable({
  providedIn: 'root'
})
export class ColorFillService implements DrawElement {
  svg: string;
  svgHtml: SafeHtml;

  trueType: TOOL_INDEX;

  points: Point[];
  isSelected: boolean;
  erasingEvidence: boolean;

  primaryColor: Color;
  erasingColor: Color;

  pointMin: Point;
  pointMax: Point;
  translate: Point;

  constructor() {
    this.svg = '';
    this.svgHtml = '';
    this.trueType = TOOL_INDEX.PAINT_BUCKET;
    this.points = [];
    this.isSelected = false;
    this.erasingEvidence = false;
    this.primaryColor = {
      RGBAString: '',
      RGBA: [0, 0, 0, 0]
    };
    this.erasingColor = ERASING_COLOR_INIT;
    this.translate = {x: 0, y: 0};
  }

  draw(): void {
    this.svg = '<path transform="translate(' + this.translate.x + ' ' + this.translate.y + ')" fill="none" '
      + `stroke="${(this.erasingEvidence) ? this.erasingColor.RGBAString :  this.primaryColor.RGBAString}" `
      + 'stroke-width="3" d="';
    for (let i = 0; i < this.points.length; ++i) {
      this.svg += (i % 2 === 0) ? 'M ' : 'L ';
      this.svg += this.points[i].x + ' ' + this.points[i].y + ' ';
    }
    this.svg += '"></path>';
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

  updateParameters(): void {
    // Aucun paramètre à modifier
  }

  translateAllPoints(): void {
    for (const point of this.points) {
      point.x += this.translate.x;
      point.y += this.translate.y;
    }
    this.translate = {x: 0, y: 0};
  }
}
