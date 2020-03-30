import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RectangleService } from '../../stockage-svg/rectangle.service';
import { Point } from '../line-tool.service';
import { ToolManagerService} from '../tool-manager.service';

export const NUMBER_OF_CONTROL_POINT = 4;
export const SELECTION_BOX_THICKNESS = 4;

@Injectable({
  providedIn: 'root'
})

export class SelectionBoxService {

  selectionBox: RectangleService;
  mouseClick: Point;
  controlPointBox: RectangleService[];

  constructor(private tools: ToolManagerService,
              private sanitizer: DomSanitizer,
              ) {}

  createSelectionBox(pointMin: Point, pointMax: Point): void {

    this.selectionBox = new RectangleService();
    this.controlPointBox = new Array<RectangleService>(NUMBER_OF_CONTROL_POINT);
    for (let index = 0; index < this.controlPointBox.length; index++) {
      this.controlPointBox[index] = new RectangleService();
    }

    this.selectionBox.isSelected = true;
    this.selectionBox.updateParameters(this.tools.activeTool);

    this.selectionBox.points[0] = pointMin;
    this.selectionBox.points[1] = pointMax;
    this.selectionBox.secondaryColor.RGBAString =  'rgba(0, 80, 150, 1)';
    this.selectionBox.thickness = SELECTION_BOX_THICKNESS;

    this.selectionBox.drawRectangle();

    this.selectionBox.svgHtml = this.sanitizer.bypassSecurityTrustHtml(this.selectionBox.svg);
    this.createControlPointBox();
  }

  createControlPointBox(): void {
    // TOP
    this.controlPointBox[0].points[0].x = ((this.selectionBox.points[0].x + this.selectionBox.points[1].x) / 2) - 4;
    this.controlPointBox[0].points[0].y = (this.selectionBox.points[0].y - 4);
    this.controlPointBox[0].points[1].x = ((this.selectionBox.points[0].x + this.selectionBox.points[1].x) / 2) + 4;
    this.controlPointBox[0].points[1].y = (this.selectionBox.points[0].y + 4);
    // BOTTOM
    this.controlPointBox[1].points[0].x = ((this.selectionBox.points[0].x + this.selectionBox.points[1].x) / 2) - 4;
    this.controlPointBox[1].points[0].y = (this.selectionBox.points[1].y - 4);
    this.controlPointBox[1].points[1].x = ((this.selectionBox.points[0].x + this.selectionBox.points[1].x) / 2) + 4;
    this.controlPointBox[1].points[1].y = (this.selectionBox.points[1].y + 4);
    // LEFT
    this.controlPointBox[2].points[0].x = (this.selectionBox.points[0].x - 4);
    this.controlPointBox[2].points[0].y = ((this.selectionBox.points[0].y + this.selectionBox.points[1].y) / 2) - 4;
    this.controlPointBox[2].points[1].x = (this.selectionBox.points[0].x + 4);
    this.controlPointBox[2].points[1].y = ((this.selectionBox.points[0].y + this.selectionBox.points[1].y) / 2) + 4;
    // RIGHT
    this.controlPointBox[NUMBER_OF_CONTROL_POINT - 1].points[0].x = (this.selectionBox.points[1].x - 4);
    this.controlPointBox[NUMBER_OF_CONTROL_POINT - 1].points[0].y = ((this.selectionBox.points[0].y
                                                                  + this.selectionBox.points[1].y) / 2) - 4;
    this.controlPointBox[NUMBER_OF_CONTROL_POINT - 1].points[1].x = (this.selectionBox.points[1].x + 4);
    this.controlPointBox[NUMBER_OF_CONTROL_POINT - 1].points[1].y = ((this.selectionBox.points[0].y
                                                                  + this.selectionBox.points[1].y) / 2) + 4;

    for (const controlPoint of this.controlPointBox) {
      controlPoint.isSelected = true;
      controlPoint.updateParameters(this.tools.activeTool);
      controlPoint.chosenOption = 'Plein avec contour';
      controlPoint.primaryColor.RGBAString =  'rgba(0, 0, 0, 1)';
      controlPoint.secondaryColor.RGBAString = 'rgba(0, 255, 0, 1)';
      controlPoint.thickness = 4;
      controlPoint.drawRectangle();

      controlPoint.svgHtml = this.sanitizer.bypassSecurityTrustHtml(controlPoint.svg);
    }

  }

  deleteSelectionBox(): void {
    delete this.selectionBox;
    if (this.controlPointBox) {
      delete this.controlPointBox;
    }
  }

  updatePosition(x: number, y: number): void {
    this.selectionBox.translate.x += x;
    this.selectionBox.translate.y += y;
    this.selectionBox.drawRectangle();
    this.selectionBox.svgHtml = this.sanitizer.bypassSecurityTrustHtml(this.selectionBox.svg);
    for (const controlPoint of this.controlPointBox) {
      controlPoint.translate.x += x;
      controlPoint.translate.y += y;
      controlPoint.drawRectangle();
      controlPoint.svgHtml = this.sanitizer.bypassSecurityTrustHtml(controlPoint.svg);
    }
  }

  updatePositionMouse(mouse: MouseEvent): void {
    this.selectionBox.translate.x = mouse.offsetX - this.mouseClick.x;
    this.selectionBox.translate.y = mouse.offsetY - this.mouseClick.y;
    this.selectionBox.drawRectangle();
    this.selectionBox.svgHtml = this.sanitizer.bypassSecurityTrustHtml(this.selectionBox.svg);
    for (const controlPoint of this.controlPointBox) {
      controlPoint.translate.x = mouse.offsetX - this.mouseClick.x;
      controlPoint.translate.y = mouse.offsetY - this.mouseClick.y;
      controlPoint.drawRectangle();
      controlPoint.svgHtml = this.sanitizer.bypassSecurityTrustHtml(controlPoint.svg);
    }
  }
}
