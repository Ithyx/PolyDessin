import { SafeHtml } from '@angular/platform-browser';
import { Point } from '../tools/line-tool.service';
import { DrawingTool } from '../tools/tool-manager.service';

export const EVIDENCE_COLOR = 'rgba(255, 0, 0, 1)';

export interface DrawElement {
  svg: string;
  svgHtml: SafeHtml;

  points: Point[];
  isSelected: boolean;
  erasingEvidence: boolean;

  primaryColor?: string;
  secondaryColor?: string;

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
