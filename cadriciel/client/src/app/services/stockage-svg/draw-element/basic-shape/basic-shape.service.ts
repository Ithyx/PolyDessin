import { Injectable } from '@angular/core';
import { Color } from 'src/app/services/color/color';
import { DrawingTool, TOOL_INDEX } from 'src/app/services/tools/tool-manager.service';
import { DrawElement, Point } from '../../draw-element/draw-element';

@Injectable({
  providedIn: 'root'
})
export abstract class BasicShapeService extends DrawElement  {
  primaryColor: Color;
  secondaryColor: Color;

  thickness: number;
  chosenOption: string;
  perimeter: string;

  strokePoints: Point[];

  constructor() {
    super();
    this.primaryColor = {
      RGBAString: '',
      RGBA: [0, 0, 0, 0]
    };
    this.secondaryColor = {
      RGBAString: '',
      RGBA: [0, 0, 0, 0]
    };
    this.points = [{x: 0, y: 0},    // points[0], coin haut gauche (base)
                   {x: 0, y: 0}];   // points[1], coin bas droite
    this.strokePoints = [];
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
      if (this.chosenOption !== 'Plein') {
        this.drawStroke();
      }
    }
    this.drawPerimeter();
  }

  abstract drawLine(): void;
  abstract drawShape(): void;
  abstract drawPerimeter(): void;

  drawStroke(): void {
    this.svg += '<polygon fill="none"' + (this.trueType === TOOL_INDEX.ELLIPSE ? 'stroke-linejoin="round' : '')
    + '" stroke="' + ((this.erasingEvidence) ? this.erasingColor.RGBAString : this.secondaryColor.RGBAString)
    + (this.isDotted ? '"stroke-dasharray="4, 4"'  : '')
    + '" stroke-width="' + this.thickness
    + '" points="';
    this.strokePoints.forEach((point) => { this.svg += ' ' + point.x + ' ' + point.y; });
    this.svg += '"></polygon>';
  }

  updateParameters(tool: DrawingTool): void {
    this.thickness = (tool.parameters[0].value) ? tool.parameters[0].value : 1;
    this.chosenOption = (tool.parameters[1].chosenOption) ? tool.parameters[1].chosenOption : '';
  }
}
