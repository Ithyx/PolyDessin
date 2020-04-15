import { Injectable } from '@angular/core';
import { TOOL_INDEX } from 'src/app/services/tools/tool-manager.service';
import { Point } from '../draw-element';
import { BasicShapeService } from './basic-shape.service';

export const ANGLE_VARIATION = 32;

@Injectable({
  providedIn: 'root'
})
export class EllipseService extends BasicShapeService {

  constructor() {
    super();
    this.trueType = TOOL_INDEX.ELLIPSE;
  }

  getWidth(): number {
    return Math.abs(this.points[ANGLE_VARIATION / 2].x - this.points[ANGLE_VARIATION + ANGLE_VARIATION / 2].x);
  }

  getHeight(): number {
    return Math.abs(this.points[ANGLE_VARIATION].y - this.points[0].y);
  }

  drawLine(): void {
    this.svg = '<line stroke-linecap="round'
      + '" transform=" matrix(' + this.transform.a + ' ' + this.transform.b + ' ' + this.transform.c + ' '
                                + this.transform.d + ' ' + this.transform.e + ' ' + this.transform.f
      + ')" stroke="' + ((this.erasingEvidence) ? this.erasingColor.RGBAString :  this.secondaryColor.RGBAString)
      + '" stroke-width="' + this.thickness
      + '" x1="' + this.pointMin.x + '" y1="' + this.pointMin.y
      + '" x2="' + (this.pointMin.x + this.getWidth())
      + '" y2="' + (this.pointMin.y + this.getHeight()) + '"></line>';
  }

  drawShape(): void {
    // ajuster les pointMin et pointMax en fonction de la position des points
    const pointMin: Point = {x: this.points[ANGLE_VARIATION + ANGLE_VARIATION / 2].x, y: this.points[0].y};
    const pointMax: Point = {x: this.points[ANGLE_VARIATION / 2].x, y: this.points[ANGLE_VARIATION].y};
    this.svg = '<ellipse transform=" matrix(' + this.transform.a + ' ' + this.transform.b + ' ' + this.transform.c + ' '
                                              + this.transform.d + ' ' + this.transform.e + ' ' + this.transform.f
      + ')" fill="' + ((this.chosenOption !== 'Contour') ? this.primaryColor.RGBAString : 'none') + '" stroke="none'
      + '" cx="' + (pointMin.x + pointMax.x) / 2 + '" cy="' + (pointMin.y + pointMax.y) / 2
      + '" rx="' + this.getWidth() / 2 + '" ry="' + this.getHeight() / 2 + '"></ellipse>';
  }

  drawStroke(): void {
    this.svg += '<ellipse transform=" matrix(' + this.strokeTransform.a + ' ' + this.strokeTransform.b + ' '
      + this.strokeTransform.c + ' ' + this.strokeTransform.d + ' ' + this.strokeTransform.e + ' ' + this.strokeTransform.f
      + ')" fill="none" stroke="' + ((this.erasingEvidence) ? this.erasingColor.RGBAString : this.secondaryColor.RGBAString)
      + '" stroke-width="' + this.thickness
      + '" cx="' + (this.pointMin.x + this.pointMax.x) / 2 + '" cy="' + (this.pointMin.y + this.pointMax.y) / 2
      + '" rx="' + this.getStrokeWidth() / 2 + '" ry="' + this.getStrokeHeight() / 2 + '"></ellipse>';
  }

  drawPerimeter(): void {
    const thickness = (this.chosenOption === 'Plein') ? 0 : this.thickness;
    this.perimeter = '<rect stroke="gray" fill="none" stroke-width="2';
    if (this.chosenOption === 'Plein') {
      this.perimeter += '" x="' + this.pointMin.x + '" y="' + this.pointMin.y
        + '" height="' + this.getHeight() + '" width="' + this.getWidth() + '"/>';
    } else {
      this.perimeter += '" x="' + (this.pointMin.x - thickness / 2)
        + '" y="' + (this.pointMin.y - thickness / 2);
      this.perimeter += '" height="' + (this.getHeight() + thickness)
        + '" width="' + (this.getWidth() + thickness) + '"/>';
    }
  }
}
