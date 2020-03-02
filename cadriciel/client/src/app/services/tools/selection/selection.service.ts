import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
  clickOnSelectionBox: boolean;

  constructor(public SVGStockage: SVGStockageService,
              public selectionBox: SelectionBoxService,
              public selectionRectangle: SelectionRectangleService,
              public drawingManager: DrawingManagerService,
              private sanitizer: DomSanitizer
             ) {
              this.clickOnSelectionBox = false;
             }

  handleClick(element: DrawElement): void {
    if (!this.selectedElements.includes(element)) {
      this.selectedElements.push(element);
      element.isSelected = true;
      this.createBoundingBox();
    }

  }

  onMouseMove(mouse: MouseEvent): void {
    if (this.clickOnSelectionBox) {
      // this.selectionBox.updatePositionMouse(mouse);
      this.updatePositionMouse(mouse);
    } else {
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
  }

  onMousePress(mouse: MouseEvent): void {
    if (!this.clickOnSelectionBox) {
      this.deleteBoundingBox();
      this.selectionRectangle.mouseDown(mouse);
    }
  }

  onMouseRelease(): void {
    if (this.clickOnSelectionBox) {
      this.clickOnSelectionBox = false;
    } else {
      // Éviter de créer une boite de sélection si on effectue un simple clic
      if (this.selectionRectangle.rectangle.getWidth() !== 0 || this.selectionRectangle.rectangle.getHeight() !== 0) {
        this.isInRectangleSelection(this.selectionRectangle.rectangle);
        this.createBoundingBox();
      }
      this.selectionRectangle.mouseUp();
      this.selectionRectangle.rectangle = new RectangleService();
    }
  }

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
    console.log('deleteBoundingBox');
    this.selectionBox.deleteSelectionBox();
    this.selectedElements = [];

    for (const element of this.SVGStockage.getCompleteSVG()) {
      if (element.isSelected) {
        element.isSelected = false;
      }
    }
  }

  isInRectangleSelection(rectangleSelection: RectangleService): void {
    let belongToRectangle = false;

    for (const element of this.SVGStockage.getCompleteSVG()) {
      for (const point of element.points) {
        const belongX = (point.x >= rectangleSelection.points[0].x && point.x <= rectangleSelection.points[1].x);
        const belongY = (point.y >= rectangleSelection.points[0].y && point.y <= rectangleSelection.points[1].y);

        if (belongX && belongY) {
          belongToRectangle = true;
        }
      }
      if (belongToRectangle) {
        element.isSelected = true;
        this.selectedElements.push(element);
        belongToRectangle = false;
      }
    }
  }

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

  updatePosition(x: number, y: number): void {
    if (this.selectionBox.selectionBox) {
      for (const element of this.SVGStockage.getCompleteSVG()) {
        if (element.isSelected) {
          element.updatePosition(x, y);
          element.SVGHtml = this.sanitizer.bypassSecurityTrustHtml(element.SVG);

          // TODO: Retirer l'élément bougé de selectedElements et le ré-insérer avec les nouveaux coordonnées
        }
      }
      this.selectionBox.updatePosition(x, y);
    }
  }


  updatePositionMouse(mouse: MouseEvent): void {
    if (this.selectionBox.selectionBox) {
      for (const element of this.SVGStockage.getCompleteSVG()) {
        if (element.isSelected) {
          element.updatePositionMouse(mouse, this.selectionBox.mouseClick);
          element.SVGHtml = this.sanitizer.bypassSecurityTrustHtml(element.SVG);

          // TODO: Retirer l'élément bougé de selectedElements et le ré-insérer avec les nouveaux coordonnées
        }
      }
      this.selectionBox.updatePositionMouse(mouse);
    }
  }

}
