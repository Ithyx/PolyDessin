import { Injectable } from '@angular/core';
import { DrawingManagerService } from '../../drawing-manager/drawing-manager.service';
import { DrawElement } from '../../stockage-svg/draw-element';
import { RectangleService } from '../../stockage-svg/rectangle.service';
import { SVGStockageService } from '../../stockage-svg/svg-stockage.service';
import { Point } from '../line-tool.service';
import { ToolInterface } from '../tool-interface';
import { SelectionBoxService } from './selection-box.service';
import { SelectionRectangleService } from './selection-rectangle.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionService implements ToolInterface {
  selectedElements: DrawElement[] = [];

  constructor(public SVGStockage: SVGStockageService,
              public selectionBox: SelectionBoxService,
              public selectionRectangle: SelectionRectangleService,
              public drawingManager: DrawingManagerService
             ) {}

  traiterClic(element: DrawElement): void {
    this.deleteBoundingBox();
    if (!this.selectedElements.includes(element)) {
      this.selectedElements.push(element);
      element.isSelected = true;
      this.createBoundingBox();
    }

  }

  onMouseMove(mouse: MouseEvent): void {
    this.selectionRectangle.mouseMouve(mouse);
    if (this.selectionRectangle.ongoingSelection) {
      this.deleteBoundingBox();
      // Éviter de créer une boite de sélection si on effectue un simple clic
      if (this.selectionRectangle.rectangle.getWidth() !== 0 || this.selectionRectangle.rectangle.getHeight() !== 0) {
        this.isInRectangleSelection(this.selectionRectangle.rectangle);
        this.createBoundingBox();
      }
    }
  }

  onMousePress(mouse: MouseEvent): void {
    this.deleteBoundingBox();
    this.selectionRectangle.mouseDown(mouse);
  }

  onMouseRelease(): void {
    // Éviter de créer une boite de sélection si on effectue un simple clic
    if (this.selectionRectangle.rectangle.getWidth() !== 0 || this.selectionRectangle.rectangle.getHeight() !== 0) {
      this.isInRectangleSelection(this.selectionRectangle.rectangle);
      this.createBoundingBox();
    }
    this.selectionRectangle.mouseUp();
    this.selectionRectangle.rectangle = new RectangleService();
  }

  createBoundingBoxAllStockageSVG(elements: Map<number, DrawElement>): void {
    let pointMin: Point = {x: elements.values().next().value.points[0].x, y: elements.values().next().value.points[0].y};
    let pointMax: Point = {x: elements.values().next().value.points[0].x, y: elements.values().next().value.points[0].y};

    for (const element of elements) {
      element[1].isSelected = true;
      for (const point of element[1].points) {
        // Point Min
        if (pointMin.x > point.x) {
          pointMin.x = point.x;
        }
        if (pointMin.y > point.y) {
          pointMin.y = point.y;
        }

        // Point Max
        if (pointMax.x < point.x) {
          pointMax.x = point.x;
        }
        if (pointMax.y < point.y) {
          pointMax.y = point.y;
        }
      }
    }

    pointMin = {x: pointMin.x - 2, y: pointMin.y - 2};
    pointMax = {x: pointMax.x + 2, y: pointMax.y + 2};

    this.selectionBox.createSelectionBox(pointMin, pointMax);
  };

  createBoundingBox(): void {
    let pointMin: Point = {x: this.drawingManager.width , y: this.drawingManager.height};
    let pointMax: Point = {x: 0 , y: 0};
    const epaisseurMin: Point = {x: 0, y: 0};
    const epaisseurMax: Point = {x: 0, y: 0};

    for (const element of this.selectedElements) {
      for (const point of element.points) {
        // Point Min
        if (pointMin.x > point.x) {
          pointMin.x = point.x;
          epaisseurMin.x = element.thickness ? element.thickness : 0;
        }
        if (pointMin.y > point.y) {
          pointMin.y = point.y;
          epaisseurMin.y = element.thickness ? element.thickness : 0;
        }

        // Point Max
        if (pointMax.x < point.x) {
          pointMax.x = point.x;
          epaisseurMax.x = element.thickness ? element.thickness : 0;
        }
        if (pointMax.y < point.y) {
          pointMax.y = point.y;
          epaisseurMax.y = element.thickness ? element.thickness : 0;
        }
      }
    }

    pointMin = {x: pointMin.x - 0.5 * epaisseurMin.x, y: pointMin.y - 0.5 * epaisseurMin.y};
    pointMax = {x: pointMax.x + 0.5 * epaisseurMax.x, y: pointMax.y + 0.5 * epaisseurMax.y};
    this.selectionBox.createSelectionBox(pointMin, pointMax);
  }

  deleteBoundingBox(): void {
    this.selectionBox.deleteSelectionBox();
    this.selectedElements = [];

    for (const element of this.SVGStockage.getCompleteSVG()) {
      if (element[1].isSelected) {
        element[1].isSelected = false;
      }
    }
  };

  isInRectangleSelection2(rectangleSelection: RectangleService): void {
    let belongToRectangle = false;

    for (const element of this.SVGStockage.getCompleteSVG()) {
      for (const point of element[1].points) {
        const belongX = (point.x >= rectangleSelection.points[0].x && point.x <= rectangleSelection.points[1].x);
        const belongY = (point.y >= rectangleSelection.points[0].y && point.y <= rectangleSelection.points[1].y);

        if (belongX && belongY) {
          belongToRectangle = true;
        }
      }
      if (belongToRectangle) {
        element[1].isSelected = true;
        this.selectedElements.push(element[1]);
        belongToRectangle = false;
      }
    }
  };

  isInRectangleSelection(rectangleSelection: RectangleService): void {

    for (const element of this.SVGStockage.getCompleteSVG()) {
      this.findPointMinAndMax(element[1]);

      const belongXMin = (rectangleSelection.points[0].x <= element[1].pointMin.x
                      && rectangleSelection.points[1].x >= element[1].pointMin.x
                      && rectangleSelection.points[0].y >= element[1].pointMin.y
                      && rectangleSelection.points[1].y <= element[1].pointMax.y);

      const belongYMin = (rectangleSelection.points[0].y <= element[1].pointMin.y
                      && rectangleSelection.points[1].y >= element[1].pointMin.y
                      && rectangleSelection.points[0].x >= element[1].pointMin.x
                      && rectangleSelection.points[0].x <= element[1].pointMax.x);

      const belongXMax = (rectangleSelection.points[0].x <= element[1].pointMax.x
                      && rectangleSelection.points[1].x >= element[1].pointMax.x
                      && rectangleSelection.points[0].y >= element[1].pointMin.y
                      && rectangleSelection.points[1].y <= element[1].pointMax.y);

      const belongYMax = (rectangleSelection.points[0].y <= element[1].pointMax.y
                      && rectangleSelection.points[1].y >= element[1].pointMax.y
                      && rectangleSelection.points[0].x >= element[1].pointMin.x
                      && rectangleSelection.points[0].x <= element[1].pointMax.x);

      if (belongXMin || belongYMin || belongXMax  || belongYMax) {
        element[1].isSelected = true;
        this.selectedElements.push(element[1]);
      }
    }
  };

  findPointMinAndMax(element: DrawElement): void {
    const pointMin: Point = {x: this.drawingManager.width , y: this.drawingManager.height};
    const pointMax: Point = {x: 0 , y: 0};

    for (const point of element.points) {
      // pointMin
      if (point.x < pointMin.x) {
        pointMin.x = point.x;
      }
      if (point.y < pointMin.y) {
        pointMin.y = point.y;
      }

      // pointMax
      if (point.x > pointMax.x) {
        pointMax.x = point.x;
      }
      if (point.y > pointMax.y) {
        pointMax.y = point.y;
      }
    }
    element.pointMin = pointMin;
    element.pointMax = pointMax;
  }

}
