import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommandManagerService } from '../../command/command-manager.service';
import { TranslateSvgService } from '../../command/translate-svg.service';
import { DrawingManagerService } from '../../drawing-manager/drawing-manager.service';
import { DrawElement } from '../../stockage-svg/draw-element';
import { RectangleService } from '../../stockage-svg/rectangle.service';
import { SVGStockageService } from '../../stockage-svg/svg-stockage.service';
import { Point } from '../line-tool.service';
import { ToolInterface } from '../tool-interface';
import { SelectionBoxService } from './selection-box.service';
import { SelectionRectangleService } from './selection-rectangle.service';

const HALF_DRAW_ELEMENT = 0.5 ;
const COLLISIONS_NEEDED = 4;

@Injectable({
  providedIn: 'root'
})

export class SelectionService implements ToolInterface {
  selectedElements: DrawElement[] = [];
  clickOnSelectionBox: boolean;
  clickInSelectionBox: boolean;

  constructor(public SVGStockage: SVGStockageService,
              public selectionBox: SelectionBoxService,
              public selectionRectangle: SelectionRectangleService,
              private drawingManager: DrawingManagerService,
              private sanitizer: DomSanitizer,
              private command: CommandManagerService
             ) {
              this.clickOnSelectionBox = false;
              this.clickInSelectionBox = false;
             }

  handleClick(drawElement: DrawElement): void {
    for (const element of this.selectedElements) {
      element.isSelected = false;
    }
    drawElement.isSelected = true;
    this.selectedElements.splice(0, this.selectedElements.length);
    this.selectedElements.push(drawElement);
    this.createBoundingBox();

  }

  handleRightClick(element: DrawElement): void {
    if (this.selectedElements.includes(element)) {
      element.isSelected = false;
      const index = this.selectedElements.indexOf(element, 0);
      this.selectedElements.splice(index, 1);
      if (this.selectedElements.length === 0) {
        this.deleteBoundingBox();
      } else {
        this.createBoundingBox();
      }
    } else {
      element.isSelected = true;
      this.selectedElements.push(element);
      this.createBoundingBox();
    }
  }

  onMouseMove(mouse: MouseEvent): void {
    if (this.clickOnSelectionBox || this.clickInSelectionBox) {
      this.updatePositionMouse(mouse);
    } else {
      this.selectionRectangle.mouseMove(mouse);
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
    if (!this.clickOnSelectionBox && !this.clickInSelectionBox) {
      this.selectionRectangle.mouseDown(mouse);
    }
  }

  onMouseRelease(mouse: MouseEvent): void {
    if (this.clickOnSelectionBox || this.clickInSelectionBox) {
      this.clickOnSelectionBox = false;
      this.clickInSelectionBox = false;
      /* for (const element of this.selectedElements) {
          element.translateAllPoints();
      }*/
      if (this.hasMoved()) {
        this.command.execute(new TranslateSvgService(
          this.selectedElements,
          this.selectionBox,
          this.sanitizer,
          this.deleteBoundingBox
        ));
      }
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
    if (this.selectedElements.length !== 0) {
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
  }

  deleteBoundingBox(): void {
    this.selectionBox.deleteSelectionBox();
    this.selectedElements.splice(0, this.selectedElements.length);
    /*for (const element of this.SVGStockage.getCompleteSVG()) {
      if (element.isSelected) {
        element.isSelected = false;
      }
    }*/
    for (const element of this.selectedElements) {
      element.isSelected = false;
    }
    this.selectedElements = [];
  }

  isInRectangleSelection(rectangleSelection: RectangleService): void {
    this.findPointMinAndMax(rectangleSelection);

    for (const element of this.SVGStockage.getCompleteSVG()) {
      this.findPointMinAndMax(element);
      if (this.belongToRectangle(element, this.selectionRectangle.rectangle) && !this.selectedElements.includes(element)) {
        element.isSelected = true;
        this.selectedElements.push(element);
      }
    }
  }

  belongToRectangle(element: DrawElement, rectangle: RectangleService): boolean {
    // BOTTOM RIGHT corner of element with TOP LEFT corner of selection
    const collision1 = element.pointMax.x >= rectangle.pointMin.x && element.pointMax.y >= rectangle.pointMin.y;
    // BOTTOM LEFT corner of element with TOP RIGHT corner of selection
    const collision2 = element.pointMin.x <= rectangle.pointMax.x && element.pointMax.y >= rectangle.pointMin.y;
    // TOP LEFT corner of element with BOTTOM RIGHT corner of selection
    const collision3 = element.pointMin.x <= rectangle.pointMax.x && element.pointMin.y <= rectangle.pointMax.y;
    // TOP RIGHT corner of element with BOTTOM LEFT corner of selection
    const collision4 =  element.pointMax.x >= rectangle.pointMin.x && element.pointMin.y <= rectangle.pointMax.y;

    let nbCollisions = 0;

    if (collision1) {
      nbCollisions++;
    }
    if (collision2) {
      nbCollisions++;
    }
    if (collision3) {
      nbCollisions++;
    }
    if (collision4) {
      nbCollisions++;
    }
    return (nbCollisions === COLLISIONS_NEEDED);
  }

  findPointMinAndMax(element: DrawElement): void {
    const pointMin: Point = {x: this.drawingManager.width , y: this.drawingManager.height};
    const pointMax: Point = {x: 0 , y: 0};
    const epaisseurMin: Point = {x: 0, y: 0};
    const epaisseurMax: Point = {x: 0, y: 0};

    for (const point of element.points) {
      // pointMin
      if (point.x < pointMin.x) {
        pointMin.x = point.x;
        epaisseurMin.x = element.thickness ? element.thickness : 0;
      }
      if (point.y < pointMin.y) {
        pointMin.y = point.y;
        epaisseurMin.y = element.thickness ? element.thickness : 0;
      }

      // pointMax
      if (point.x > pointMax.x) {
        pointMax.x = point.x;
        epaisseurMax.x = element.thickness ? element.thickness : 0;
      }
      if (point.y > pointMax.y) {
        pointMax.y = point.y;
        epaisseurMax.y = element.thickness ? element.thickness : 0;
      }
    }
    element.pointMin = {x: pointMin.x - HALF_DRAW_ELEMENT * epaisseurMin.x, y: pointMin.y - HALF_DRAW_ELEMENT * epaisseurMin.y};
    element.pointMax = {x: pointMax.x + HALF_DRAW_ELEMENT * epaisseurMax.x, y: pointMax.y + HALF_DRAW_ELEMENT * epaisseurMax.y };
  }

  updatePosition(x: number, y: number): void {
    if (this.selectionBox.selectionBox) {
      // for (const element of this.SVGStockage.getCompleteSVG()) {
      for (const element of this.selectedElements) {
        // if (element.isSelected) {
          // this.selectedElements.splice(this.selectedElements.indexOf(element), 1);
          element.updatePosition(x, y);
          element.svgHtml = this.sanitizer.bypassSecurityTrustHtml(element.svg);
          // this.selectedElements.push(element);
        // }
      }
      this.selectionBox.updatePosition(x, y);
    }
  }

  updatePositionMouse(mouse: MouseEvent): void {
    if (this.selectionBox.selectionBox) {
      // for (const element of this.SVGStockage.getCompleteSVG()) {
      for (const element of this.selectedElements) {
        // if (element.isSelected) {
          // this.selectedElements.splice(this.selectedElements.indexOf(element), 1);
          element.updatePositionMouse(mouse, this.selectionBox.mouseClick);
          element.svgHtml = this.sanitizer.bypassSecurityTrustHtml(element.svg);
          // this.selectedElements.push(element);
        // }
      }
      this.selectionBox.updatePositionMouse(mouse);
    }
  }

  hasMoved(): boolean {
    const xTranslation = this.selectedElements[0].translate.x !== 0;
    const yTranslation = this.selectedElements[0].translate.y !== 0;
    return xTranslation || yTranslation;
  }

}
