import { Injectable } from '@angular/core';
import { Color } from '../../color/color';
import { DrawingTool, TOOL_INDEX } from '../../tools/tool-manager.service';
import { DrawElement, Point} from '../draw-element/draw-element';

export const MIN_DIAMETER = 5;

@Injectable({
  providedIn: 'root'
})
export class SprayService extends DrawElement {
  diameter: number;
  primaryColor: Color;

  constructor() {
    super();
    this.trueType = TOOL_INDEX.SPRAY;
    this.primaryColor = {
      RGBAString: '',
      RGBA: [0, 0, 0, 0]
    };
  }

  draw(): void {
    this.svg = '';
    for (const point of this.points) {
      this.svg += '<circle transform=" matrix(' + this.transform.a + ' ' + this.transform.b + ' ' + this.transform.c + ' '
                                                + this.transform.d + ' ' + this.transform.e + ' ' + this.transform.f
      + `)" cx="${point.x}" cy="${point.y}" r="1" `
      + `fill="${(this.erasingEvidence) ? this.erasingColor.RGBAString :  this.primaryColor.RGBAString}"></circle>`;
    }
  }

  addPoint(mousePosition: Point): void {
    const position = Math.random() * (this.diameter ? this.diameter / 2 : 1);
    const angle = Math.random() * 2 * Math.PI;
    const x = mousePosition.x + position * Math.cos(angle);
    const y = mousePosition.y + position * Math.sin(angle);
    this.points.push({x, y});
    this.svg += '<circle transform=" matrix(' + this.transform.a + ' ' + this.transform.b + ' ' + this.transform.c + ' '
                                              + this.transform.d + ' ' + this.transform.e + ' ' + this.transform.f
      + `)" cx="${x}" cy="${y}" r="1" `
      + `fill="${(this.erasingEvidence) ? this.erasingColor.RGBAString :  this.primaryColor.RGBAString}"></circle>`;
  }

  updateParameters(tool: DrawingTool): void {
    this.diameter = (tool.parameters[0].value) ? tool.parameters[0].value : MIN_DIAMETER;
  }
}
