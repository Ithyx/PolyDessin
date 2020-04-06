import { Injectable } from '@angular/core';
import { TOOL_INDEX } from 'src/app/services/tools/tool-manager.service';
import { BasicShapeService } from './basic-shape.service';

@Injectable({
  providedIn: 'root'
})
export class EllipseService extends BasicShapeService {

  constructor() {
    super();
    this.trueType = TOOL_INDEX.ELLIPSE;
  }

  drawLine(): void {
    this.svg = '<line stroke-linecap="round'
      + '" transform=" matrix(' + this.transform.a + ' ' + this.transform.b + ' ' + this.transform.c + ' '
                                + this.transform.d + ' ' + this.transform.e + ' ' + this.transform.f
      + ')" stroke="' + ((this.erasingEvidence) ? this.erasingColor.RGBAString :  this.secondaryColor.RGBAString)
      + '" stroke-width="' + this.thickness
      + '" x1="' + this.points[0].x + '" y1="' + this.points[0].y
      + '" x2="' + (this.points[0].x + this.getWidth())
      + '" y2="' + (this.points[0].y + this.getHeight()) + '"></line>';
  }

  drawShape(): void {
    this.svg = '<ellipse transform=" matrix(' + this.transform.a + ' ' + this.transform.b + ' ' + this.transform.c + ' '
                                              + this.transform.d + ' ' + this.transform.e + ' ' + this.transform.f
      + ')" fill="' + ((this.chosenOption !== 'Contour') ? this.primaryColor.RGBAString : 'none')
      + '" stroke="'
      + ((this.erasingEvidence) ? this.erasingColor.RGBAString :
        ((this.chosenOption !== 'Plein') ? this.secondaryColor.RGBAString : 'none'))
      + '" stroke-width="' + this.thickness
      + '" cx="' + (this.points[0].x + this.points[1].x) / 2 + '" cy="' + (this.points[0].y + this.points[1].y) / 2
      + '" rx="' + this.getWidth() / 2 + '" ry="' + this.getHeight() / 2 + '"></ellipse>';
  }

  drawPerimeter(): void {
    const thickness = (this.chosenOption === 'Plein') ? 0 : this.thickness;
    this.perimeter = '<rect stroke="gray" fill="none" stroke-width="2';
    if (this.chosenOption === 'Plein') {
      this.perimeter += '" x="' + this.points[0].x + '" y="' + this.points[0].y
        + '" height="' + this.getHeight() + '" width="' + this.getWidth() + '"/>';
    } else {
      this.perimeter += '" x="' + (this.points[0].x - thickness / 2)
        + '" y="' + (this.points[0].y - thickness / 2);
      this.perimeter += '" height="' + (this.getHeight() + thickness)
        + '" width="' + (this.getWidth() + thickness) + '"/>';
    }
  }
}
