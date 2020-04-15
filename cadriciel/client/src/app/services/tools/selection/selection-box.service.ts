import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RectangleService } from '../../stockage-svg/draw-element/basic-shape/rectangle.service';
import { Point } from '../../stockage-svg/draw-element/draw-element';
import { ToolManagerService} from '../tool-manager.service';

export enum ControlPosition {
  NONE,
  UP,
  DOWN,
  LEFT,
  RIGHT
}

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
  controlPosition: ControlPosition; // Point de contrôle sélectionné pour redimensionnement
  scaleCenter: Point;

  constructor(private tools: ToolManagerService,
              private sanitizer: DomSanitizer,
              ) {
                this.controlPosition = ControlPosition.NONE;
                this.scaleCenter = {x: 0, y: 0};
                this.mouseClick = {x: 0, y: 0};
              }

  createSelectionBox(pointMin: Point, pointMax: Point): void {

    // ajuster les valeurs de boite de sélection pour qu'elle reste fixe avec le redimensionnement
    switch (this.controlPosition) {
      case ControlPosition.UP:
        pointMax.y = this.scaleCenter.y;
        break;
      case ControlPosition.DOWN:
        pointMin.y = this.scaleCenter.y;
        break;
      case ControlPosition.LEFT:
        pointMax.x = this.scaleCenter.x;
        break;
      case ControlPosition.RIGHT:
        pointMin.x = this.scaleCenter.x;
        break;
    }

    this.box = new RectangleService();
    this.controlPointBox = new Array<RectangleService>(NUMBER_OF_CONTROL_POINT);
    for (let index = 0; index < this.controlPointBox.length; index++) {
      this.controlPointBox[index] = new RectangleService();
    }

    // this.box.isSelected = true;
    this.box.updateParameters(this.tools.activeTool);

    this.box.points[0] = pointMin;
    this.box.points[1] = pointMax;
    this.box.addRectanglePoints();
    this.box.strokePoints = [
      {...this.box.points[0]}, {...this.box.points[2]},
      {...this.box.points[1]}, {...this.box.points[this.box.points.length - 1]}
    ];
    this.box.secondaryColor.RGBAString =  'rgba(0, 80, 150, 1)';
    this.box.thickness = SELECTION_BOX_THICKNESS;

    this.box.drawShape();
    this.box.drawStroke();

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
      // controlPoint.isSelected = true;
      controlPoint.updateParameters(this.tools.activeTool);
      controlPoint.chosenOption = 'Plein avec contour';
      controlPoint.primaryColor.RGBAString =  'rgba(0, 0, 0, 1)';
      controlPoint.secondaryColor.RGBAString = 'rgba(0, 255, 0, 1)';
      controlPoint.thickness = CONTROL_POINT_THICKNESS;
      controlPoint.addRectanglePoints();
      controlPoint.strokePoints = [
        {...controlPoint.points[0]}, {...controlPoint.points[2]},
        {...controlPoint.points[1]}, {...controlPoint.points[controlPoint.points.length - 1]}
      ];
      controlPoint.drawShape();
      controlPoint.drawStroke();

      controlPoint.svgHtml = this.sanitizer.bypassSecurityTrustHtml(controlPoint.svg);
    }

  }

  deleteSelectionBox(): void {
    delete this.box;
    if (this.controlPointBox) {
      delete this.controlPointBox;
    }
  }

  // TODO: VÉRIFIER LES TESTS :

  updateTranslation(x: number, y: number): void {
    this.box.updateTranslation(x, y);
    this.box.svgHtml = this.sanitizer.bypassSecurityTrustHtml(this.box.svg);
    for (const controlPoint of this.controlPointBox) {
      controlPoint.updateTranslation(x, y);
      controlPoint.svgHtml = this.sanitizer.bypassSecurityTrustHtml(controlPoint.svg);
    }
  }

  updateTranslationMouse(mouse: MouseEvent): void {
    this.box.updateTranslationMouse(mouse);
    this.box.svgHtml = this.sanitizer.bypassSecurityTrustHtml(this.box.svg);
    for (const controlPoint of this.controlPointBox) {
      controlPoint.updateTranslationMouse(mouse);
      controlPoint.svgHtml = this.sanitizer.bypassSecurityTrustHtml(controlPoint.svg);
    }
  }

  controlPointMouseDown(mouse: MouseEvent, index: number): void {
    this.mouseClick = {x: mouse.offsetX, y: mouse.offsetY};
    this.scaleCenter = {...this.mouseClick};
    this.controlPosition = index + 1;
    switch (this.controlPosition) {
      case ControlPosition.UP:
        this.scaleCenter.y = this.box.points[1].y;
        break;
      case ControlPosition.DOWN:
        this.scaleCenter.y = this.box.points[0].y;
        break;
      case ControlPosition.LEFT:
        this.scaleCenter.x = this.box.points[1].x;
        break;
      case ControlPosition.RIGHT:
        this.scaleCenter.x = this.box.points[0].x;
        break;
    }
  }
}
