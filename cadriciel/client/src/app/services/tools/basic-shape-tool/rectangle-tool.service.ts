import { Injectable } from '@angular/core';
import { RectangleService } from '../../stockage-svg/draw-element/basic-shape/rectangle.service';
import { BasicShapeToolService } from './basic-shape-tool.service';

@Injectable({
  providedIn: 'root'
})
export class RectangleToolService extends BasicShapeToolService {
  clear(): void {
    this.commands.drawingInProgress = false;
    this.shape = new RectangleService();
    this.initial = {x: 0, y: 0};
    this.calculatedBase = {x: 0, y: 0};
    this.calculatedWidth = 0;
    this.calculatedHeight = 0;
  }

  calculateStrokePoints(): void {
    this.shape.strokePoints = [
      {...this.shape.points[0]}, {...this.shape.points[2]},
      {...this.shape.points[1]}, {...this.shape.points[this.shape.points.length - 1]}
    ];
  }
}
