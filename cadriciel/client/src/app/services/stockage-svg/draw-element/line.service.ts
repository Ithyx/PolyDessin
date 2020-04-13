import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Color } from '../../color/color';
import { DrawingTool, TOOL_INDEX } from '../../tools/tool-manager.service';
import { DrawElement, ERASING_COLOR_INIT, Point, TransformMatrix } from '../draw-element/draw-element';
import { HALF_CIRCLE } from './basic-shape/basic-shape.service';

@Injectable({
  providedIn: 'root'
})
export class LineService implements DrawElement {
  svg: string;
  svgHtml: SafeHtml;

  trueType: TOOL_INDEX;

  points: Point[];
  // isSelected: boolean;
  erasingEvidence: boolean;
  hasMoved: boolean;

  primaryColor: Color;
  erasingColor: Color;

  thicknessLine: number;
  thicknessPoint: number;
  thickness: number;
  chosenOption: string;
  isAPolygon: boolean;
  mousePosition: Point;

  pointMin: Point;
  pointMax: Point;
 transform: TransformMatrix;

  constructor() {
    this.svgHtml = '';
    this.trueType = TOOL_INDEX.LINE;
    this.points = [];
    // this.isSelected = false;
    this.erasingEvidence = false;
    this.hasMoved = true;
    this.primaryColor = {
      RGBAString: '',
      RGBA: [0, 0, 0, 0]
    };
    this.erasingColor = ERASING_COLOR_INIT;
    this.isAPolygon = false;
    this.mousePosition = {x: 0, y: 0};
    this.transform = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0};
  }

  draw(): void {
    this.svg = (this.isAPolygon) ? '<polygon ' : '<polyline ';
    this.svg += 'transform=" matrix(' + this.transform.a + ' ' + this.transform.b + ' ' + this.transform.c + ' '
                                        + this.transform.d + ' ' + this.transform.e + ' ' + this.transform.f + ')" ';
    this.svg += 'fill="none" stroke="' + ((this.erasingEvidence) ? this.erasingColor.RGBAString :  this.primaryColor.RGBAString);
    this.svg += '" stroke-width="' + this.thicknessLine;
    this.svg += '" points="';
    for (const point of this.points) {
      this.svg += point.x + ' ' + point.y + ' ';
    }
    if (!this.isAPolygon) {
      this.svg += this.mousePosition.x + ' ' + this.mousePosition.y;
    }
    this.svg += `"></${(this.isAPolygon) ? 'polygon' : 'polyline'}>`;
    if (this.chosenOption === 'Avec points') {
      this.thickness = this.thicknessLine;
      this.drawPoints();
    }
  }

  drawPoints(): void {
    if (this.thicknessPoint) {
      if (2 * this.thicknessPoint > this.thickness) {
        this.thickness = 2 * this.thicknessPoint;
      }
      this.thicknessPoint = this.thicknessPoint;
    }
    for (const point of this.points) {
      this.svg += '<circle transform=" matrix(' + this.transform.a + ' ' + this.transform.b + ' ' + this.transform.c + ' '
                                                + this.transform.d + ' ' + this.transform.e + ' ' + this.transform.f
      + ')" cx="' + point.x + '" cy="' + point.y + '" r="' + this.thicknessPoint
      + '" fill="' + ((this.erasingEvidence) ? this.erasingColor.RGBAString :  this.primaryColor.RGBAString) + '"></circle>';
    }
  }

  isEmpty(): boolean {
    return this.points.length === 0 ||
      (this.points.length === 1 && this.chosenOption === 'Sans points');
  }

  updateTranslation(x: number, y: number): void {
    const translationMatrix = {a: 1, b: 0, c: 0, d: 1, e: x, f: y};
    this.hasMoved = true;
    this.updateTransform(translationMatrix);
   }

   updateTranslationMouse(mouse: MouseEvent, mouseClick: Point): void {
    const x = mouse.movementX;
    const y = mouse.movementY;
    const translationMatrix = {a: 1, b: 0, c: 0, d: 1, e: x, f: y};
    this.hasMoved = true;
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
    const oldTransform = {...this.transform};
    this.transform.a = oldTransform.a * matrix.a + oldTransform.b * matrix.c;
    this.transform.b = oldTransform.a * matrix.b + oldTransform.b * matrix.d;
    this.transform.c = oldTransform.c * matrix.a + oldTransform.d * matrix.c;
    this.transform.d = oldTransform.c * matrix.b + oldTransform.d * matrix.d;
    this.transform.e = oldTransform.e * matrix.a + oldTransform.f * matrix.c + matrix.e;
    this.transform.f = oldTransform.e * matrix.b + oldTransform.f * matrix.d + matrix.f;
    this.draw();
  }

  updateParameters(tool: DrawingTool): void {
    this.thicknessLine = (tool.parameters[0].value) ? tool.parameters[0].value : 1;
    this.chosenOption = (tool.parameters[1].chosenOption) ? tool.parameters[1].chosenOption : '';
    this.thicknessPoint = (tool.parameters[2].value) ? tool.parameters[2].value : 1;
  }

  translateAllPoints(): void { }
}
