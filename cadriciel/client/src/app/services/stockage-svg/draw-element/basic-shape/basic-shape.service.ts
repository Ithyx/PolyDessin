import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Color } from 'src/app/services/color/color';
import { DrawingTool, TOOL_INDEX } from 'src/app/services/tools/tool-manager.service';
import { DrawElement, ERASING_COLOR_INIT, Point, TransformMatrix } from '../../draw-element/draw-element';

export const HALF_CIRCLE = 180;

@Injectable({
  providedIn: 'root'
})
export abstract class BasicShapeService implements DrawElement  {
  svg: string;
  svgHtml: SafeHtml;

  trueType: TOOL_INDEX;

  points: Point[];
  isSelected: boolean;
  erasingEvidence: boolean;
  hasMoved: boolean;

  primaryColor: Color;
  secondaryColor: Color;
  erasingColor: Color;

  thickness: number;
  chosenOption: string;
  perimeter: string;

  pointMin: Point;
  pointMax: Point;
 transform: TransformMatrix;

  constructor() {
    this.svgHtml = '';
    this.primaryColor = {
      RGBAString: '',
      RGBA: [0, 0, 0, 0]
    };
    this.secondaryColor = {
      RGBAString: '',
      RGBA: [0, 0, 0, 0]
    };
    this.erasingColor = ERASING_COLOR_INIT;
    this.points = [{x: 0, y: 0},    // points[0], coin haut gauche (base)
                   {x: 0, y: 0}],    // points[1], coin bas droite
    this.isSelected = false;
    this.erasingEvidence = false;
    this.hasMoved = true;
    this.transform = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0};
    this.pointMin = {x: 0, y: 0};
    this.pointMax = {x: 0, y: 0};
  }

  getWidth(): number {
    return Math.abs(this.points[1].x - this.points[0].x);
  }

  getHeight(): number {
    return Math.abs(this.points[1].y - this.points[0].y);
  }

  draw(): void {
    if ((this.getWidth() === 0 || this.getHeight() === 0) && this.chosenOption !== 'Plein') {
      this.drawLine();
    } else {
      this.drawShape();
    }
    this.drawPerimeter();
  }

  abstract drawLine(): void;
  abstract drawShape(): void;
  abstract drawPerimeter(): void;

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
    this.thickness = (tool.parameters[0].value) ? tool.parameters[0].value : 1;
    this.chosenOption = (tool.parameters[1].chosenOption) ? tool.parameters[1].chosenOption : '';
  }

  translateAllPoints(): void {}
}
