import { SafeHtml } from '@angular/platform-browser';
import { Color, RGB_MAX } from '../../color/color';
import { DrawingTool, TOOL_INDEX } from '../../tools/tool-manager.service';

export interface Point {
  x: number;
  y: number;
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

  translate: Point;

  draw(): void;
  updatePosition(x: number, y: number): void;
  updatePositionMouse(mouse: MouseEvent, mouseClick: Point): void;
  updateParameters(tool: DrawingTool): void;
  translateAllPoints(): void;
}
