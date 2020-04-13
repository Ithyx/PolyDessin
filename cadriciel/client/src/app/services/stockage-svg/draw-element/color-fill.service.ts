import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Color } from '../../color/color';
import { TOOL_INDEX } from '../../tools/tool-manager.service';
import { HALF_CIRCLE } from './basic-shape/basic-shape.service';
import { DrawElement, ERASING_COLOR_INIT, Point, TransformMatrix } from './draw-element';

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

  hasMoved: boolean;
  transform: TransformMatrix;

  primaryColor: Color;
  erasingColor: Color;

  pointMin: Point;
  pointMax: Point;

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
    this.transform = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0};
  }

  draw(): void {
    this.svg = '<path transform=" matrix(' + this.transform.a + ' ' + this.transform.b + ' ' + this.transform.c + ' '
    + this.transform.d + ' ' + this.transform.e + ' ' + this.transform.f + ')" ' + ')" fill="none" '
      + `stroke="${(this.erasingEvidence) ? this.erasingColor.RGBAString :  this.primaryColor.RGBAString}" `
      + 'stroke-width="3" d="';
    for (let i = 0; i < this.points.length; ++i) {
      this.svg += (i % 2 === 0) ? 'M ' : 'L ';
      this.svg += this.points[i].x + ' ' + this.points[i].y + ' ';
    }
    this.svg += '"></path>';
  }

  /* updatePosition(x: number, y: number): void {
    this.translate.x += x;
    this.translate.y += y;
    this.draw();
  }

  updatePositionMouse(mouse: MouseEvent, mouseClick: Point): void {
    this.translate.x = mouse.offsetX - mouseClick.x;
    this.translate.y = mouse.offsetY - mouseClick.y;
    this.draw();
  } */

  updateParameters(): void {
    // Aucun paramètre à modifier
  }

  translateAllPoints(): void {
    // TODO: À retirer
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
}
