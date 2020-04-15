import { Injectable } from '@angular/core';
import { TOOL_INDEX } from 'src/app/services/tools/tool-manager.service';
import { Point } from '../draw-element';
import { BasicShapeService } from './basic-shape.service';

@Injectable({
  providedIn: 'root'
})
export class PolygonService extends BasicShapeService {
  strokePoints: Point[];

  constructor() {
    super();
    this.trueType = TOOL_INDEX.POLYGON;
    this.strokePoints = [];
  }

  draw(): void {
    this.drawShape();
    if (this.chosenOption !== 'Plein') {
      this.drawStroke();
    }
    this.drawPerimeter();
  }

  drawLine(): void { /*L'outil ne trace jamais de lignes*/ }

  drawShape(): void {
    this.svg = '<polygon transform=" matrix(' + this.transform.a + ' ' + this.transform.b + ' ' + this.transform.c + ' '
                                              + this.transform.d + ' ' + this.transform.e + ' ' + this.transform.f
      + ')" fill="' + ((this.chosenOption !== 'Contour') ? this.primaryColor.RGBAString : 'none') + '" stroke="none'
      + '" stroke-width="' + this.thickness + '" points="';
    for (const point of this.points) {
      this.svg += point.x + ' ' + point.y + ' ';
    }
    this.svg += '"></polygon>';
  }

  drawStroke(): void {
    this.svg += '<polygon transform=" matrix(' + this.strokeTransform.a + ' ' + this.strokeTransform.b + ' ' + this.strokeTransform.c
                                         + ' ' + this.strokeTransform.d + ' ' + this.strokeTransform.e + ' ' + this.strokeTransform.f
      + ')" fill="none" stroke="' + ((this.erasingEvidence) ? this.erasingColor.RGBAString : this.secondaryColor.RGBAString)
      + '" stroke-width="' + this.thickness + '" points="';
    for (const point of this.strokePoints) {
      this.svg += point.x + ' ' + point.y + ' ';
    }
    this.svg += '"></polygon>';
  }

  drawPerimeter(): void {
    this.perimeter = '<rect stroke="gray" fill="none" stroke-width="2';
    if (this.chosenOption === 'Plein') {
      this.perimeter += '" x="' + this.pointMin.x + '" y="' + this.pointMin.y
        + '" height="' + this.getStrokeHeight() + '" width="' + this.getStrokeWidth() + '"/>';
    } else {
      this.perimeter += '" x="' + (this.pointMin.x - this.thickness / 2)
        + '" y="' + (this.pointMin.y - this.thickness / 2);
      this.perimeter += '" height="' + (this.getStrokeHeight() + this.thickness)
        + '" width="' + (this.getStrokeWidth() + this.thickness) + '"/>';
    }
  }

  updateScale(scale: Point, center: Point): void {
    for (const point of this.strokePoints) {
      point.x = scale.x * point.x + (1 - scale.x) * center.x;
      point.y = scale.y * point.y + (1 - scale.y) * center.y;
    }
    super.updateScale(scale, center);
  }
}
