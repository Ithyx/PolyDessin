import { Injectable } from '@angular/core';
import { TOOL_INDEX } from '../tools/tool-manager.service';
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
      + '" transform=" translate(' + this.translate.x + ' ' + this.translate.y
      + ')" stroke="' + ((this.erasingEvidence) ? this.erasingColor.RGBAString :  this.secondaryColor.RGBAString)
      + '" stroke-width="' + this.thickness
      + (this.isDotted ? '"stroke-dasharray="2, 8"'  : '')
      + '" x1="' + this.points[0].x + '" y1="' + this.points[0].y
      + '" x2="' + (this.points[0].x + this.getWidth())
      + '" y2="' + (this.points[0].y + this.getHeight()) + '"></line>';
  }

  drawShape(): void {
    const choosedOption = this.chosenOption;
    this.svg = '<rect transform=" translate(' + this.translate.x + ' ' + this.translate.y +
      ')" fill="' + ((choosedOption !== 'Contour') ? this.primaryColor.RGBAString : 'none') + '" stroke="'
      + ((this.erasingEvidence) ? this.erasingColor.RGBAString :
        ((this.chosenOption !== 'Plein') ? this.secondaryColor.RGBAString : 'none'))
      + (this.isDotted ? '"stroke-dasharray="4, 4"'  : '')
      + '" stroke-width="' + this.thickness
      + '" x="' + this.points[0].x + '" y="' + this.points[0].y
      + '" width="' + this.getWidth() + '" height="' + this.getHeight() + '"></rect>';
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
  }
}
