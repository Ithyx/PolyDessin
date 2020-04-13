import { Injectable } from '@angular/core';
import { Color } from '../../color/color';
import { TOOL_INDEX } from '../../tools/tool-manager.service';
import { DrawElement } from './draw-element';

@Injectable({
  providedIn: 'root'
})
export class ColorFillService extends DrawElement {
  primaryColor: Color;

  constructor() {
    super();
    this.trueType = TOOL_INDEX.PAINT_BUCKET;
    this.primaryColor = {
      RGBAString: '',
      RGBA: [0, 0, 0, 0]
    };
  }

  draw(): void {
    this.svg = '<path transform=" matrix(' + this.transform.a + ' ' + this.transform.b + ' ' + this.transform.c + ' '
    + this.transform.d + ' ' + this.transform.e + ' ' + this.transform.f + ')" fill="none" '
      + `stroke="${(this.erasingEvidence) ? this.erasingColor.RGBAString :  this.primaryColor.RGBAString}" `
      + 'stroke-width="3" d="';
    for (let i = 0; i < this.points.length; ++i) {
      this.svg += (i % 2 === 0) ? 'M ' : 'L ';
      this.svg += this.points[i].x + ' ' + this.points[i].y + ' ';
    }
    this.svg += '"></path>';
  }

  updateParameters(): void {
    // Aucun paramètre à modifier
  }
}
