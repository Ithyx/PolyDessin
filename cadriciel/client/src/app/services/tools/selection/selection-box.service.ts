import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RectangleService } from '../../stockage-svg/rectangle.service';
import { Point } from '../line-tool.service';
import { ToolManagerService} from '../tool-manager.service';
@Injectable({
  providedIn: 'root'
})
export class SelectionBoxService {

  selectionBox: RectangleService;
  mouseClick: Point;
  controlPointBox: RectangleService[];

  constructor(public tools: ToolManagerService,
              private sanitizer: DomSanitizer,
              ) {
              }

  createSelectionBox(pointMin: Point, pointMax: Point): void {

    this.selectionBox = new RectangleService();
    this.controlPointBox = new Array<RectangleService>(4);
    for (let index = 0; index < this.controlPointBox.length; index++) {
      this.controlPointBox[index] = new RectangleService();
    }

    this.selectionBox.isSelected = true;
    this.selectionBox.tool = this.tools.activeTool;

    this.selectionBox.points[0] = pointMin;
    this.selectionBox.points[1] = pointMax;
    this.selectionBox.secondaryColor =  'rgba(0, 80, 150, 1)';
    this.selectionBox.thickness = 4;

    this.selectionBox.drawRectangle();

    this.selectionBox.SVGHtml = this.sanitizer.bypassSecurityTrustHtml(this.selectionBox.SVG);
    this.createControlPointBox();
  }

  createControlPointBox(): void {
    // TOP
    this.controlPointBox[0].points[0].x = ((this.selectionBox.points[0].x + this.selectionBox.points[1].x)/2) - 4;
    this.controlPointBox[0].points[0].y = (this.selectionBox.points[0].y - 4);
    this.controlPointBox[0].points[1].x = ((this.selectionBox.points[0].x + this.selectionBox.points[1].x)/2) + 4;
    this.controlPointBox[0].points[1].y = (this.selectionBox.points[0].y + 4);
    // BOTTOM
    this.controlPointBox[1].points[0].x = ((this.selectionBox.points[0].x + this.selectionBox.points[1].x)/2) - 4;
    this.controlPointBox[1].points[0].y = (this.selectionBox.points[1].y - 4);
    this.controlPointBox[1].points[1].x = ((this.selectionBox.points[0].x + this.selectionBox.points[1].x)/2) + 4;
    this.controlPointBox[1].points[1].y = (this.selectionBox.points[1].y + 4);
    // LEFT
    this.controlPointBox[2].points[0].x = (this.selectionBox.points[0].x - 4); 
    this.controlPointBox[2].points[0].y = ((this.selectionBox.points[0].y + this.selectionBox.points[1].y)/2) - 4;
    this.controlPointBox[2].points[1].x = (this.selectionBox.points[0].x + 4);
    this.controlPointBox[2].points[1].y = ((this.selectionBox.points[0].y + this.selectionBox.points[1].y)/2) + 4;
    // RIGHT
    this.controlPointBox[3].points[0].x = (this.selectionBox.points[1].x - 4); 
    this.controlPointBox[3].points[0].y = ((this.selectionBox.points[0].y + this.selectionBox.points[1].y)/2) - 4;
    this.controlPointBox[3].points[1].x = (this.selectionBox.points[1].x + 4);
    this.controlPointBox[3].points[1].y = ((this.selectionBox.points[0].y + this.selectionBox.points[1].y)/2) + 4;

    for (const controlPoint of this.controlPointBox) {
      controlPoint.isSelected = true;
      controlPoint.tool = this.tools.activeTool;
      controlPoint.secondaryColor =  'rgba(173, 255, 47, 1)';
      controlPoint.thickness = 4;
      controlPoint.drawRectangle();

      controlPoint.SVGHtml = this.sanitizer.bypassSecurityTrustHtml(controlPoint.SVG);
    }

  }

  deleteSelectionBox(): void {
    delete this.selectionBox;
    if(this.controlPointBox) {
      for (let index = 0; index < this.controlPointBox.length; index++) {
        delete this.controlPointBox[index];
      }
      delete this.controlPointBox;
    }
  }

  updatePosition(x: number, y: number): void {
    this.selectionBox.translate.x += x;
    this.selectionBox.translate.y += y;
    this.selectionBox.drawRectangle();
    this.selectionBox.SVGHtml = this.sanitizer.bypassSecurityTrustHtml(this.selectionBox.SVG);
    for (const controlPoint of this.controlPointBox) {
      controlPoint.translate.x += x;
      controlPoint.translate.y += y;
      controlPoint.drawRectangle();
      controlPoint.SVGHtml = this.sanitizer.bypassSecurityTrustHtml(controlPoint.SVG);
    }
  }

  updatePositionMouse(mouse: MouseEvent): void {
    this.selectionBox.translate.x = mouse.offsetX - this.mouseClick.x;
    this.selectionBox.translate.y = mouse.offsetY - this.mouseClick.y;
    this.selectionBox.drawRectangle();
    this.selectionBox.SVGHtml = this.sanitizer.bypassSecurityTrustHtml(this.selectionBox.SVG);
    for (const controlPoint of this.controlPointBox) {
      controlPoint.translate.x = mouse.offsetX - this.mouseClick.x;
      controlPoint.translate.y = mouse.offsetY - this.mouseClick.y;
      controlPoint.drawRectangle();
      controlPoint.SVGHtml = this.sanitizer.bypassSecurityTrustHtml(controlPoint.SVG);
    }
  }
}
