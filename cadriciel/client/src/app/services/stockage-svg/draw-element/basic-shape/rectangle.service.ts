import { Injectable } from '@angular/core';
import { TOOL_INDEX } from 'src/app/services/tools/tool-manager.service';
import { BasicShapeService } from './basic-shape.service';

@Injectable({
  providedIn: 'root'
})
export class RectangleService extends BasicShapeService {
  isDotted: boolean;

  constructor() {
    super();
    this.isDotted = false;
    this.trueType = TOOL_INDEX.RECTANGLE;
  }

  drawLine(): void {
    this.svg = '<line stroke-linecap="square'
      + '" transform=" matrix(' + this.transform.a + ' ' + this.transform.b + ' ' + this.transform.c + ' '
      + this.transform.d + ' ' + this.transform.e + ' ' + this.transform.f
      + ')" stroke="' + ((this.erasingEvidence) ? this.erasingColor.RGBAString :  this.secondaryColor.RGBAString)
      + '" stroke-width="' + this.thickness
      + (this.isDotted ? '"stroke-dasharray="2, 8"'  : '')
      + '" x1="' + this.points[0].x + '" y1="' + this.points[0].y
      + '" x2="' + (this.points[0].x + this.getWidth())
      + '" y2="' + (this.points[0].y + this.getHeight()) + '"></line>';
  }

  drawShape(): void {
    this.svg = '<rect transform=" matrix(' + this.transform.a + ' ' + this.transform.b + ' ' + this.transform.c + ' '
                                           + this.transform.d + ' ' + this.transform.e + ' ' + this.transform.f
      + ')" fill="' + ((this.chosenOption !== 'Contour') ? this.primaryColor.RGBAString : 'none') + '" stroke="none'
      + '" x="' + this.points[0].x + '" y="' + this.points[0].y
      + '" width="' + this.getWidth() + '" height="' + this.getHeight() + '"></rect>';
    this.addRectanglePoints();
  }

  drawStroke(): void {
    this.svg += '<rect transform=" matrix(' + this.strokeTransform.a + ' ' + this.strokeTransform.b + ' ' + this.strokeTransform.c + ' '
                                           + this.strokeTransform.d + ' ' + this.strokeTransform.e + ' ' + this.strokeTransform.f
      + ')" fill="none" stroke="' + ((this.erasingEvidence) ? this.erasingColor.RGBAString : this.secondaryColor.RGBAString)
      + (this.isDotted ? '"stroke-dasharray="4, 4"'  : '')
      + '" stroke-width="' + this.thickness
      + '" x="' + this.pointMin.x + '" y="' + this.pointMin.y
      + '" width="' + this.getStrokeWidth() + '" height="' + this.getStrokeHeight() + '"></rect>';
  }

  drawPerimeter(): void {
    const thickness = (this.chosenOption === 'Plein') ? 0 : this.thickness;
    this.perimeter = '<rect stroke="gray" fill="none" stroke-width="2' + (this.isDotted ? '"stroke-dasharray="4, 4"'  : '');
    if (this.chosenOption === 'Plein') {
      this.perimeter += '" x="' + this.points[0].x + '" y="' + this.points[0].y
        + '" height="' + this.getHeight() + '" width="' + this.getWidth() + '"></rect>';
    } else {
      this.perimeter += '" x="' + (this.points[0].x - thickness / 2)
        + '" y="' + (this.points[0].y - thickness / 2);
      this.perimeter += '" height="' + ((this.getHeight() === 0) ? thickness : (this.getHeight() + thickness))
        + '" width="' + ((this.getWidth() === 0) ? thickness : (this.getWidth() + thickness)) + '"></rect>';
    }
    this.addRectanglePoints();
  }

  addRectanglePoints(): void {
    this.points.splice(2, 2);
    this.points.push({x: this.points[1].x, y: this.points[0].y}, {x: this.points[0].x, y: this.points[1].y});
  }
}
