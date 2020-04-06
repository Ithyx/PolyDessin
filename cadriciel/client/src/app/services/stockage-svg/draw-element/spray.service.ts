import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Color } from '../../color/color';
import { DrawingTool, TOOL_INDEX } from '../../tools/tool-manager.service';
import { DrawElement, ERASING_COLOR_INIT, Point, TransformMatrix} from '../draw-element/draw-element';
import { HALF_CIRCLE } from './basic-shape/basic-shape.service';

export const MIN_DIAMETER = 5;

@Injectable({
  providedIn: 'root'
})
export class SprayService implements DrawElement {

  svg: string;
  svgHtml: SafeHtml;
  isSelected: boolean;
  erasingEvidence: boolean;
  hasMoved: boolean;

  trueType: TOOL_INDEX;

  diameter: number;
  points: Point[] = [];

  primaryColor: Color;
  erasingColor: Color;

  pointMin: Point;
  pointMax: Point;
  transform: TransformMatrix;

  constructor() {
    this.svgHtml = '';
    this.trueType = TOOL_INDEX.SPRAY;
    this.isSelected = false;
    this.hasMoved = true;
    this.primaryColor = {
      RGBAString: '',
      RGBA: [0, 0, 0, 0]
    };
    this.erasingColor = ERASING_COLOR_INIT;
    this.erasingEvidence = false;
    this.transform = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0};
  }

  draw(): void {
    this.svg = '';
    for (const point of this.points) {
      this.svg += '<circle #svg transform=" matrix(' + this.transform.a + ' ' + this.transform.b + ' ' + this.transform.c + ' '
                                                + this.transform.d + ' ' + this.transform.e + ' ' + this.transform.f
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
    this.svg += '<circle transform=" matrix(' + this.transform.a + ' ' + this.transform.b + ' ' + this.transform.c + ' '
                                              + this.transform.d + ' ' + this.transform.e + ' ' + this.transform.f
      + `)" cx="${x}" cy="${y}" r="1" `
      + `fill="${(this.erasingEvidence) ? this.erasingColor.RGBAString :  this.primaryColor.RGBAString}"></circle>`;
  }

  updateTranslation(x: number, y: number): void {
    const translationMatrix = {a: 1, b: 0, c: 0, d: 1, e: x, f: y};
    this.hasMoved = true;
    this.updateTransform(translationMatrix);
   }

  updateTranslationMouse(mouse: MouseEvent, mouseClick: Point): void {
    const x = mouse.movementX;
    const y = mouse.movementY;
    this.hasMoved = true;
    const translationMatrix = {a: 1, b: 0, c: 0, d: 1, e: x, f: y};
    this.updateTransform(translationMatrix);
  }

  updateRotation(x: number, y: number, angle: number): void {
    const radianAngle = angle * (Math.PI / HALF_CIRCLE);
    const aRotation = Math.cos(radianAngle);
    const bRotation = Math.sin(radianAngle);
    const cRotation = -Math.sin(radianAngle);
    const dRotation = Math.cos(radianAngle);
    const eRotation = (1 - Math.cos(radianAngle)) * x + Math.sin(radianAngle) * y;
    const fRotation = (1 - Math.cos(radianAngle)) * y - Math.sin(radianAngle) * x;
    const rotationMatrix = {a: aRotation, b: bRotation, c: cRotation, d: dRotation, e: eRotation, f: fRotation };
    this.updateTransform(rotationMatrix);
  }

  updateTransform(matrix: TransformMatrix): void {
    this.transform.a = this.transform.a * matrix.a + this.transform.b * matrix.c;
    this.transform.b = this.transform.a * matrix.b + this.transform.b * matrix.d;
    this.transform.c = this.transform.c * matrix.a + this.transform.d * matrix.c;
    this.transform.d = this.transform.c * matrix.b + this.transform.d * matrix.d;
    this.transform.e = this.transform.e * matrix.a + this.transform.f * matrix.c + matrix.e;
    this.transform.f = this.transform.e * matrix.b + this.transform.f * matrix.d + matrix.f;
    this.draw();
  }

  updateParameters(tool: DrawingTool): void {
    this.diameter = (tool.parameters[0].value) ? tool.parameters[0].value : MIN_DIAMETER;
  }

  translateAllPoints(): void { }
}
