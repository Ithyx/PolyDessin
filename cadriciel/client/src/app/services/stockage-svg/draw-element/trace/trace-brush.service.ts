import { Injectable } from '@angular/core';
import { DrawingTool, TOOL_INDEX } from '../../../tools/tool-manager.service';
import { TraceService } from './trace.service';

@Injectable({
  providedIn: 'root'
})
export class TraceBrushService extends TraceService {
  chosenOption: string;

  constructor() {
    super();
    this.trueType = TOOL_INDEX.BRUSH;
  }

  drawPath(): void {
    this.svg = '<path transform=" matrix(' + this.transform.a + ' ' + this.transform.b + ' ' + this.transform.c + ' '
                                            + this.transform.d + ' ' + this.transform.e + ' ' + this.transform.f
      + ')" fill="none" '
      + `stroke="${(this.erasingEvidence) ? this.erasingColor.RGBAString :  this.primaryColor.RGBAString}"`
      + ' filter="url(#' + this.chosenOption
      + ')" stroke-linejoin="round" stroke-linecap="round" stroke-width="' + this.thickness + '" d="';
    for (let i = 0; i < this.points.length; ++i) {
      this.svg += (i === 0) ? 'M ' : 'L ';
      this.svg += this.points[i].x + ' ' + this.points[i].y + ' ';
    }
    this.svg += '"></path>';
  }

  drawPoint(): void {
    this.svg = '<circle cx="' + this.points[0].x + '" cy="' + this.points[0].y
      + '" transform=" matrix(' + this.transform.a + ' ' + this.transform.b + ' ' + this.transform.c + ' '
                                + this.transform.d + ' ' + this.transform.e + ' ' + this.transform.f
      + ')" filter="url(#' + this.chosenOption
      + ')" r="' + this.thickness / 2
      + '" fill="' + ((this.erasingEvidence) ? this.erasingColor.RGBAString :  this.primaryColor.RGBAString) + '"></circle>';
  }

  updateParameters(tool: DrawingTool): void {
    this.thickness = (tool.parameters[0].value) ? tool.parameters[0].value : 1;
    this.chosenOption = (tool.parameters[1].chosenOption) ? tool.parameters[1].chosenOption : '';
  }
}
