import { Injectable } from '@angular/core';
import { EllipseService } from '../../stockage-svg/draw-element/basic-shape/ellipse.service';
import { BasicShapeToolService } from './basic-shape-tool.service';

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
}
