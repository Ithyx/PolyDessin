import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Color } from 'src/app/services/color/color';
import { DrawingTool, TOOL_INDEX } from 'src/app/services/tools/tool-manager.service';
import { DrawElement, ERASING_COLOR_INIT, Point, TransformMatrix } from '../../draw-element/draw-element';
import { HALF_CIRCLE } from '../basic-shape/basic-shape.service';

@Injectable({
  providedIn: 'root'
})
export abstract class TraceService implements DrawElement {
  svg: string;
  svgHtml: SafeHtml;

  trueType: TOOL_INDEX;

  points: Point[];
  isSelected: boolean;
  erasingEvidence: boolean;
  hasMoved: boolean;

  primaryColor: Color;
  erasingColor: Color;

  thickness: number;

  isAPoint: boolean;

  pointMin: Point;
  pointMax: Point;

 transform: TransformMatrix;

  constructor() {
    this.svgHtml = '';
    this.points = [];
    this.isSelected = false;
    this.primaryColor = {
      RGBAString: '',
      RGBA: [0, 0, 0, 0]
    };
    this.erasingColor = ERASING_COLOR_INIT;
    this.erasingEvidence = false;
    this.isAPoint = false;
    this.hasMoved = true;
    this.pointMin = {x: 0 , y: 0};
    this.pointMax = {x: 0 , y: 0};
    this.transform = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0};
  }

  draw(): void {
    if (this.isAPoint) {
      this.drawPoint();
    } else {
      this.drawPath();
    }
  }

  updateTranslation(x: number, y: number): void {
    const translationMatrix = {a: 1, b: 0, c: 0, d: 1, e: x, f: y};
    this.updateTransform(translationMatrix);
    this.hasMoved = true;
   }

   updateTranslationMouse(mouse: MouseEvent, mouseClick: Point): void {
    const x = mouse.movementX;
    const y = mouse.movementY;
    const translationMatrix = {a: 1, b: 0, c: 0, d: 1, e: x, f: y};
    this.updateTransform(translationMatrix);
    this.hasMoved = true;
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

  translateAllPoints(): void { }

  abstract drawPath(): void;
  abstract drawPoint(): void;
  abstract updateParameters(tool: DrawingTool): void;
}
