import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RectangleService } from '../../stockage-svg/draw-element/basic-shape/rectangle.service';
import { Point } from '../../stockage-svg/draw-element/draw-element';
import { ToolManagerService} from '../tool-manager.service';

export const NUMBER_OF_CONTROL_POINT = 4;
export const SELECTION_BOX_THICKNESS = 4;
const CONTROL_POINT_THICKNESS = 4;

@Injectable({
  providedIn: 'root'
})

export class SelectionBoxService {

  box: RectangleService;
  mouseClick: Point;
  controlPointBox: RectangleService[];

  constructor(private tools: ToolManagerService,
              private sanitizer: DomSanitizer,
              ) {}

  createSelectionBox(pointMin: Point, pointMax: Point): void {

    this.box = new RectangleService();
    this.controlPointBox = new Array<RectangleService>(NUMBER_OF_CONTROL_POINT);
    for (let index = 0; index < this.controlPointBox.length; index++) {
      this.controlPointBox[index] = new RectangleService();
    }

    this.box.isSelected = true;
    this.box.updateParameters(this.tools.activeTool);

    this.box.points[0] = pointMin;
    this.box.points[1] = pointMax;
    this.box.secondaryColor.RGBAString =  'rgba(0, 80, 150, 1)';
    this.box.thickness = SELECTION_BOX_THICKNESS;

    this.box.drawShape();

    this.box.svgHtml = this.sanitizer.bypassSecurityTrustHtml(this.box.svg);
    this.createControlPointBox();
  }

  createControlPointBox(): void {
    // TOP
    this.controlPointBox[0].points[0].x = ((this.box.points[0].x + this.box.points[1].x) / 2) - CONTROL_POINT_THICKNESS;
    this.controlPointBox[0].points[0].y = (this.box.points[0].y - CONTROL_POINT_THICKNESS);
    this.controlPointBox[0].points[1].x = ((this.box.points[0].x + this.box.points[1].x) / 2) + CONTROL_POINT_THICKNESS;
    this.controlPointBox[0].points[1].y = (this.box.points[0].y + CONTROL_POINT_THICKNESS);
    // BOTTOM
    this.controlPointBox[1].points[0].x = ((this.box.points[0].x + this.box.points[1].x) / 2) - CONTROL_POINT_THICKNESS;
    this.controlPointBox[1].points[0].y = (this.box.points[1].y - CONTROL_POINT_THICKNESS);
    this.controlPointBox[1].points[1].x = ((this.box.points[0].x + this.box.points[1].x) / 2) + CONTROL_POINT_THICKNESS;
    this.controlPointBox[1].points[1].y = (this.box.points[1].y + CONTROL_POINT_THICKNESS);
    // LEFT
    this.controlPointBox[2].points[0].x = (this.box.points[0].x - CONTROL_POINT_THICKNESS);
    this.controlPointBox[2].points[0].y = ((this.box.points[0].y + this.box.points[1].y) / 2) - CONTROL_POINT_THICKNESS;
    this.controlPointBox[2].points[1].x = (this.box.points[0].x + CONTROL_POINT_THICKNESS);
    this.controlPointBox[2].points[1].y = ((this.box.points[0].y + this.box.points[1].y) / 2) + CONTROL_POINT_THICKNESS;
    // RIGHT
    this.controlPointBox[NUMBER_OF_CONTROL_POINT - 1].points[0].x = (this.box.points[1].x - CONTROL_POINT_THICKNESS);
    this.controlPointBox[NUMBER_OF_CONTROL_POINT - 1].points[0].y = ((this.box.points[0].y
                                                                  + this.box.points[1].y) / 2) - CONTROL_POINT_THICKNESS;
    this.controlPointBox[NUMBER_OF_CONTROL_POINT - 1].points[1].x = (this.box.points[1].x + CONTROL_POINT_THICKNESS);
    this.controlPointBox[NUMBER_OF_CONTROL_POINT - 1].points[1].y = ((this.box.points[0].y
                                                                  + this.box.points[1].y) / 2) + CONTROL_POINT_THICKNESS;

    for (const controlPoint of this.controlPointBox) {
      controlPoint.isSelected = true;
      controlPoint.updateParameters(this.tools.activeTool);
      controlPoint.chosenOption = 'Plein avec contour';
      controlPoint.primaryColor.RGBAString =  'rgba(0, 0, 0, 1)';
      controlPoint.secondaryColor.RGBAString = 'rgba(0, 255, 0, 1)';
      controlPoint.thickness = CONTROL_POINT_THICKNESS;
      controlPoint.drawShape();

      controlPoint.svgHtml = this.sanitizer.bypassSecurityTrustHtml(controlPoint.svg);
    }

  }

  deleteSelectionBox(): void {
    delete this.box;
    if (this.controlPointBox) {
      delete this.controlPointBox;
    }
  }

  updateTranslation(x: number, y: number): void {
    this.box.updateTranslation(x, y);
    this.box.svgHtml = this.sanitizer.bypassSecurityTrustHtml(this.box.svg);
    for (const controlPoint of this.controlPointBox) {
      controlPoint.updateTranslation(x, y);
      controlPoint.svgHtml = this.sanitizer.bypassSecurityTrustHtml(controlPoint.svg);
    }
  }

  updateTranslationMouse(mouse: MouseEvent): void {
    this.box.updateTranslationMouse(mouse, this.mouseClick);
    this.box.svgHtml = this.sanitizer.bypassSecurityTrustHtml(this.box.svg);
    for (const controlPoint of this.controlPointBox) {
      controlPoint.updateTranslationMouse(mouse, this.mouseClick);
      controlPoint.svgHtml = this.sanitizer.bypassSecurityTrustHtml(controlPoint.svg);
    }
  }
}
