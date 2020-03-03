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

const HALF_DRAW_ELEMENT = 0.5 ;

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
      element.isSelected = true;
      this.selectedElements.push(element);
      this.createBoundingBox();
    }

  }

  onMouseMove(mouse: MouseEvent): void {
    if (this.clickOnSelectionBox) {
      this.updatePositionMouse(mouse);
    } else {
      this.selectionRectangle.mouseMove(mouse);
      if (this.selectionRectangle.ongoingSelection) {
        this.deleteBoundingBox();
        // Éviter de créer une boite de sélection si on effectue un simple clic
        if (this.selectionRectangle.rectangle.getWidth() !== 0 || this.selectionRectangle.rectangle.getHeight() !== 0) {
          this.isInRectangleSelection(this.selectionRectangle.rectangle, mouse);
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

  onMouseRelease(mouse: MouseEvent): void {
    if (this.clickOnSelectionBox) {
      this.clickOnSelectionBox = false;
      for (const element of this.selectedElements) {
        if (element.isSelected) {
          element.translateAllPoints();
        }
      }
    } else {
      // Éviter de créer une boite de sélection si on effectue un simple clic
      if (this.selectionRectangle.rectangle.getWidth() !== 0 || this.selectionRectangle.rectangle.getHeight() !== 0) {
        this.isInRectangleSelection(this.selectionRectangle.rectangle, mouse);
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
        if (pointMin.x > point.x + element.translate.x) {
          pointMin.x = point.x + element.translate.x;
          epaisseurMin.x = element.thickness ? element.thickness : 0;
        }
        if (pointMin.y > point.y + element.translate.y) {
          pointMin.y = point.y + element.translate.y;
          epaisseurMin.y = element.thickness ? element.thickness : 0;
        }

        // Point Max
        if (pointMax.x < point.x + element.translate.x) {
          pointMax.x = point.x + element.translate.x;
          epaisseurMax.x = element.thickness ? element.thickness : 0;
        }
        if (pointMax.y < point.y + element.translate.y) {
          pointMax.y = point.y + element.translate.y;
          epaisseurMax.y = element.thickness ? element.thickness : 0;
        }
      }
    }

    pointMin = {x: pointMin.x - HALF_DRAW_ELEMENT * epaisseurMin.x, y: pointMin.y - HALF_DRAW_ELEMENT * epaisseurMin.y};
    pointMax = {x: pointMax.x + HALF_DRAW_ELEMENT * epaisseurMax.x, y: pointMax.y + HALF_DRAW_ELEMENT * epaisseurMax.y};
    this.selectionBox.createSelectionBox(pointMin, pointMax);
  }

  deleteBoundingBox(): void {
    this.selectionBox.deleteSelectionBox();
    this.selectedElements = [];

    for (const element of this.SVGStockage.getCompleteSVG()) {
      if (element.isSelected) {
        element.isSelected = false;
      }
    }
  }

  isInRectangleSelection(rectangleSelection: RectangleService, mouse: MouseEvent): void {
    this.findPointMinAndMax(rectangleSelection);
    let belongToRectangle = false;

    for (const element of this.SVGStockage.getCompleteSVG()) {
      this.findPointMinAndMax(element);
      for (const point of element.points) {
        const belongX = (point.x + element.translate.x >= rectangleSelection.points[0].x
                      && point.x + element.translate.x <= rectangleSelection.points[1].x);
        const belongY = (point.y + element.translate.y >= rectangleSelection.points[0].y
                      && point.y + element.translate.y <= rectangleSelection.points[1].y);

        if (belongX && belongY) {
          belongToRectangle = true;
        }
      }

      const mouseCornerSelection = (mouse.offsetX >= element.pointMin.x && mouse.offsetX <= element.pointMax.x)
                            && (mouse.offsetY >= element.pointMin.y && mouse.offsetY <= element.pointMax.y);
      
      const xCornerSelection = (rectangleSelection.pointMin.x >= element.pointMin.x && rectangleSelection.pointMin.x <= element.pointMax.x)
                          && (mouse.offsetY >= element.pointMin.y && mouse.offsetY <= element.pointMax.y);

      const yCornerSelection = (mouse.offsetX >= element.pointMin.x && mouse.offsetX <= element.pointMax.x)
                          && (rectangleSelection.pointMax.y >= element.pointMin.y && rectangleSelection.pointMax.y <= element.pointMax.y);


      let mouseBelongToElement = mouseCornerSelection || xCornerSelection || yCornerSelection;

      if (belongToRectangle || mouseBelongToElement) {
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
          this.selectedElements.splice(this.selectedElements.indexOf(element), 1);
          element.updatePosition(x, y);
          element.SVGHtml = this.sanitizer.bypassSecurityTrustHtml(element.SVG);

          this.selectedElements.push(element);
        }
      }
      this.selectionBox.updatePosition(x, y);
    }
  }

  updatePositionMouse(mouse: MouseEvent): void {
    if (this.selectionBox.selectionBox) {
      for (const element of this.SVGStockage.getCompleteSVG()) {
        if (element.isSelected) {
          this.selectedElements.splice(this.selectedElements.indexOf(element), 1);
          element.updatePositionMouse(mouse, this.selectionBox.mouseClick);
          element.SVGHtml = this.sanitizer.bypassSecurityTrustHtml(element.SVG);

          this.selectedElements.push(element);
        }
      }
      this.selectionBox.updatePositionMouse(mouse);
    }
  }

}
