import { SafeHtml } from '@angular/platform-browser';
import { Color, RGB_MAX } from '../../color/color';
import { DrawingTool, TOOL_INDEX } from '../../tools/tool-manager.service';

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

export interface DrawElement {
  svg: string;
  svgHtml: SafeHtml;

  trueType: TOOL_INDEX;

  points: Point[];
  isSelected: boolean;
  erasingEvidence: boolean;
  hasMoved: boolean;

  primaryColor?: Color;
  secondaryColor?: Color;
  erasingColor: Color;

  thickness?: number;
  thicknessLine?: number;
  thicknessPoint?: number;
  texture?: string;
  perimeter?: string;
  isAPoint?: boolean;     // Peut être retiré
  isDotted?: boolean;
  chosenOption?: string;
  isAPolygon?: boolean;

  pointMin: Point;
  pointMax: Point;

  transform: TransformMatrix;

  draw(): void;
  updateTranslation(x: number, y: number): void;
  updateTranslationMouse(mouse: MouseEvent, mouseClick: Point): void;
  updateRotation(x: number, y: number, angle: number): void;
  updateTransform(matrix: TransformMatrix): void;
  updateParameters(tool: DrawingTool): void;
  translateAllPoints(): void;
}
