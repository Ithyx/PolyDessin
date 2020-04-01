import { Injectable } from '@angular/core';
import { RectangleService } from '../../stockage-svg/rectangle.service';
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
}
