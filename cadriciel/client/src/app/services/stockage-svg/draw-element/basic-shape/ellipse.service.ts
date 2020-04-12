import { Injectable } from '@angular/core';
import { TOOL_INDEX } from 'src/app/services/tools/tool-manager.service';
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
    return this.pointMax.x - this.pointMin.x;
  }

  getHeight(): number {
    return this.pointMax.y - this.pointMin.y;
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
    this.pointMin.x = this.points[ANGLE_VARIATION + ANGLE_VARIATION / 2].x;
    this.pointMin.y = this.points[0].y;
    this.pointMax.x = this.points[ANGLE_VARIATION / 2].x;
    this.pointMax.y = this.points[ANGLE_VARIATION].y;
    this.svg = '<ellipse transform=" matrix(' + this.transform.a + ' ' + this.transform.b + ' ' + this.transform.c + ' '
                                              + this.transform.d + ' ' + this.transform.e + ' ' + this.transform.f
      + ')" fill="' + ((this.chosenOption !== 'Contour') ? this.primaryColor.RGBAString : 'none')
      + '" stroke="'
      + ((this.erasingEvidence) ? this.erasingColor.RGBAString :
        ((this.chosenOption !== 'Plein') ? this.secondaryColor.RGBAString : 'none'))
      + '" stroke-width="' + this.thickness
      + '" cx="' + (this.pointMin.x + this.pointMax.x) / 2 + '" cy="' + (this.pointMin.y + this.pointMax.y) / 2
      + '" rx="' + this.getWidth() / 2 + '" ry="' + this.getHeight() / 2 + '"></ellipse>';
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
