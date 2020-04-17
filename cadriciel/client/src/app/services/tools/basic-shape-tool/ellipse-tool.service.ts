import { Injectable } from '@angular/core';
import { ANGLE_VARIATION, EllipseService } from '../../stockage-svg/draw-element/basic-shape/ellipse.service';
import { Point } from '../../stockage-svg/draw-element/draw-element';
import { BasicShapeToolService } from './basic-shape-tool.service';
import { ENDING_ANGLE, STARTING_ANGLE } from './polygon-tool.service';

@Injectable({
  providedIn: 'root'
})
export class EllipseToolService extends BasicShapeToolService {
  clear(): void {
    this.commands.drawingInProgress = false;
    this.shape = new EllipseService();
    this.initial = {x: 0, y: 0};
    this.calculatedBase = {x: 0, y: 0};
    this.calculatedWidth = 0;
    this.calculatedHeight = 0;
  }

  refreshSVG(): void {
    this.shape.pointMin = {...this.shape.points[0]};
    this.shape.pointMax = {...this.shape.points[1]};
    const width = Math.abs(this.shape.points[1].x - this.shape.points[0].x);
    const height = Math.abs(this.shape.points[1].y - this.shape.points[0].y);
    const center: Point = {
      x: this.shape.pointMin.x + width / 2,
      y: this.shape.pointMin.y + height / 2
    };
    this.shape.points = [];
    for (let angle = STARTING_ANGLE; angle < ENDING_ANGLE; angle += Math.PI / ANGLE_VARIATION) {
      this.shape.points.push({
        x: (width / 2) * Math.cos(angle) + center.x,
        y: (height / 2) * Math.sin(angle) + center.y
      });
    }
    super.refreshSVG();
  }
}
