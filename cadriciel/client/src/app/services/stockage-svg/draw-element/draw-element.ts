import { SafeHtml } from '@angular/platform-browser';
import { Color, RGB_MAX } from '../../color/color';
import { DrawingTool, TOOL_INDEX } from '../../tools/tool-manager.service';

export const HALF_CIRCLE = 180;

export interface Point {
  x: number;
  y: number;
}

// La matrice de transformation est une matrice de dimensions 3x3 structurée ainsi:
//
//  | a c e |
//  | b d f |
//  | 0 0 1 |
//
export interface TransformMatrix {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

export const ERASING_COLOR_INIT: Color = {
  RGBAString: 'rgba(255, 0, 0, 1)',
  RGBA: [RGB_MAX, 0, 0, 1]
};

export abstract class DrawElement {
  svg: string;
  svgHtml: SafeHtml;

  trueType: TOOL_INDEX;

  points: Point[];
  strokePoints?: Point[];
  erasingEvidence: boolean;

  primaryColor?: Color;
  secondaryColor?: Color;
  erasingColor: Color;

  thickness?: number;
  thicknessLine?: number;
  thicknessPoint?: number;
  texture?: string;
  perimeter?: string;
  isAPoint?: boolean;
  isDotted?: boolean;
  chosenOption?: string;
  isAPolygon?: boolean;

  pointMin: Point;
  pointMax: Point;

  transform: TransformMatrix;
  strokeTransform?: TransformMatrix;

  constructor() {
    this.svg = '';
    this.svgHtml = '';
    this.points = [];
    this.erasingColor = ERASING_COLOR_INIT;
    this.erasingEvidence = false;
    this.transform = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0};
    this.pointMin = {x: 0, y: 0};
    this.pointMax = {x: 0, y: 0};
  }

  abstract draw(): void;
  abstract updateParameters(tool: DrawingTool): void;

  updateTranslation(x: number, y: number): void {
    const translationMatrix = {a: 1, b: 0, c: 0, d: 1, e: x, f: y};
    this.updateTransform(translationMatrix);
   }

   updateTranslationMouse(mouse: MouseEvent): void {
    const x = mouse.movementX;
    const y = mouse.movementY;
    const translationMatrix: TransformMatrix = {a: 1, b: 0, c: 0, d: 1, e: x, f: y};
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
    const rotationMatrix: TransformMatrix = {a: aRotation, b: bRotation, c: cRotation, d: dRotation, e: eRotation, f: fRotation };
    this.updateTransform(rotationMatrix);
  }

  updateScale(scale: Point, center: Point): void {
    const eScale = (1 - scale.x) * center.x;
    const fScale = (1 - scale.y) * center.y;
    const scaleMatrix: TransformMatrix = {a: scale.x, b: 0, c: 0, d: scale.y, e: eScale, f: fScale};
    this.updateTransform(scaleMatrix);
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
