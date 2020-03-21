import { SafeHtml } from '@angular/platform-browser';
import { Point } from '../tools/line-tool.service';
import { DrawingTool } from '../tools/tool-manager.service';

const RGB_MAX = 255;

export const ERASING_COLOR_INIT: Color = {
  RGBAString: 'rgba(255, 0, 0, 1)',
  RGBA: [RGB_MAX, 0, 0, 1]
};

export const R = 0;
export const G = 1;
export const B = 2;
export const A = 3;

export interface Color {
  RGBAString: string;
  RGBA: [number, number, number, number];
}

export interface DrawElement {
  svg: string;
  svgHtml: SafeHtml;

  points: Point[];
  isSelected: boolean;
  erasingEvidence: boolean;

  primaryColor?: Color;
  secondaryColor?: Color;
  erasingColor: Color;

  texture?: string;
  thickness?: number;
  perimeter?: string;
  isAPoint?: boolean;               // Possible Refactoring ? Vraiment Utile?
  isDotted?: boolean;
  chosenOption?: string;

  pointMin: Point;
  pointMax: Point;

  translate: Point;

  draw(): void;
  updatePosition(x: number, y: number): void;
  updatePositionMouse(mouse: MouseEvent, mouseClick: Point): void;
  updateParameters(tool: DrawingTool): void;
  translateAllPoints(): void;
}
