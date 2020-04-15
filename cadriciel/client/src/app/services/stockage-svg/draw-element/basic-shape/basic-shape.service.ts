import { Injectable } from '@angular/core';
import { Color } from 'src/app/services/color/color';
import { DrawingTool } from 'src/app/services/tools/tool-manager.service';
import { DrawElement, TransformMatrix } from '../../draw-element/draw-element';

@Injectable({
  providedIn: 'root'
})
export abstract class BasicShapeService extends DrawElement  {
  primaryColor: Color;
  secondaryColor: Color;

  thickness: number;
  chosenOption: string;
  perimeter: string;

  strokeTransform: TransformMatrix;

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
    this.strokeTransform = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0};
  }

  getWidth(): number {
    return Math.abs(this.points[1].x - this.points[0].x);
  }

  getHeight(): number {
    return Math.abs(this.points[1].y - this.points[0].y);
  }

  getStrokeWidth(): number {
    return Math.abs(this.pointMax.x - this.pointMin.x);
  }

  getStrokeHeight(): number {
    return Math.abs(this.pointMax.y - this.pointMin.y);
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
  abstract drawStroke(): void;
  abstract drawPerimeter(): void;

  updateTransform(matrix: TransformMatrix): void {
    super.updateTransform(matrix);
    if (!this.isScaleTransform(matrix)) {
      const oldTransform = {...this.strokeTransform};
      this.strokeTransform.a = oldTransform.a * matrix.a + oldTransform.b * matrix.c;
      this.strokeTransform.b = oldTransform.a * matrix.b + oldTransform.b * matrix.d;
      this.strokeTransform.c = oldTransform.c * matrix.a + oldTransform.d * matrix.c;
      this.strokeTransform.d = oldTransform.c * matrix.b + oldTransform.d * matrix.d;
      this.strokeTransform.e = oldTransform.e * matrix.a + oldTransform.f * matrix.c + matrix.e;
      this.strokeTransform.f = oldTransform.e * matrix.b + oldTransform.f * matrix.d + matrix.f;
      this.draw();
    }
  }

  updateParameters(tool: DrawingTool): void {
    this.thickness = (tool.parameters[0].value) ? tool.parameters[0].value : 1;
    this.chosenOption = (tool.parameters[1].chosenOption) ? tool.parameters[1].chosenOption : '';
  }

  isScaleTransform(matrix: TransformMatrix): boolean {
    return matrix.b === 0 && matrix.c === 0 && (matrix.a !== 1 || matrix.d !== 1);
  }
}
