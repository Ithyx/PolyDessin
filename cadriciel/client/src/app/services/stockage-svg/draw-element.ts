import { SafeHtml } from '@angular/platform-browser';
import { Point } from '../tools/line-tool.service';

export interface DrawElement {
  SVG: string;
  SVGHtml: SafeHtml;
  // transformationSVG: string;
  // transformationSVGHtml: SafeHtml;

  points: Point[];
  isSelected: boolean;

  primaryColor?: string;
  secondaryColor?: string;

  texture?: string;
  thickness?: number;
  perimeter?: string;
  isAPoint?: boolean;               // Possible Refactoring ? Vraiment Utile?
  isDotted?: boolean;

  draw(): void;
}
