import { Injectable } from '@angular/core';
import { Color } from 'src/app/services/color/color';
import { DrawingTool } from 'src/app/services/tools/tool-manager.service';
import { DrawElement } from '../../draw-element/draw-element';

@Injectable({
  providedIn: 'root'
})
export abstract class TraceService extends DrawElement {
  primaryColor: Color;
  thickness: number;
  isAPoint: boolean;

  constructor() {
    super();
    this.primaryColor = {
      RGBAString: '',
      RGBA: [0, 0, 0, 0]
    };
    this.isAPoint = false;
  }

  draw(): void {
    if (this.isAPoint) {
      this.drawPoint();
    } else {
      this.drawPath();
    }
  }

  abstract drawPath(): void;
  abstract drawPoint(): void;
  abstract updateParameters(tool: DrawingTool): void;
}
