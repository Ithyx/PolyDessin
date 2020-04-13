import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommandManagerService } from '../../command/command-manager.service';
import { TransformSvgService } from '../../command/transform-svg.service';
import { DrawingManagerService } from '../../drawing-manager/drawing-manager.service';
import { RectangleService } from '../../stockage-svg/draw-element/basic-shape/rectangle.service';
import { DrawElement, Point } from '../../stockage-svg/draw-element/draw-element';
import { SVGStockageService } from '../../stockage-svg/svg-stockage.service';
import { ToolInterface } from '../tool-interface';
import { ControlPosition, SelectionBoxService } from './selection-box.service';
import { SelectionRectangleService } from './selection-rectangle.service';

export const LEFT_CLICK = 0;
export const RIGHT_CLICK = 2;

const HALF_DRAW_ELEMENT = 0.5 ;

@Injectable({
  providedIn: 'root'
})

export class SelectionService implements ToolInterface {
  selectedElements: DrawElement[];
  clickOnSelectionBox: boolean;
  clickInSelectionBox: boolean;

  private modifiedElement: Set<DrawElement>;
  private transformCommand: TransformSvgService;

  constructor(private svgStockage: SVGStockageService,
              public selectionBox: SelectionBoxService,
              public selectionRectangle: SelectionRectangleService,
              private drawingManager: DrawingManagerService,
              public sanitizer: DomSanitizer,
              private command: CommandManagerService
             ) {
              this.selectedElements = [];
              this.modifiedElement = new Set<DrawElement>();
              this.clickOnSelectionBox = false;
              this.clickInSelectionBox = false;
             }

  handleClick(drawElement: DrawElement): void {
    // for (const element of this.selectedElements) {
      // element.isSelected = false;
    // }
    // drawElement.isSelected = true;
    this.selectedElements.splice(0, this.selectedElements.length);
    this.selectedElements.push(drawElement);
    this.createBoundingBox();
  }

  handleRightClick(element: DrawElement): void {
    if (this.selectedElements.includes(element)) {
      // element.isSelected = false;
      const index = this.selectedElements.indexOf(element, 0);
      this.selectedElements.splice(index, 1);
      if (this.selectedElements.length === 0) {
        this.deleteBoundingBox();
      } else {
        this.createBoundingBox();
      }
    } else {
      // element.isSelected = true;
      this.selectedElements.push(element);
      this.createBoundingBox();
    }
  }

  onMouseMove(mouse: MouseEvent): void {
    if (this.selectionBox.controlPosition !== ControlPosition.NONE) {
      this.resizeElements(mouse);
      return;
    }
    if (this.clickOnSelectionBox || this.clickInSelectionBox) {
      this.updateTranslationMouse(mouse);
    } else {
      this.selectionRectangle.mouseMove(mouse);
      if (this.selectionRectangle.ongoingSelection) {
        if (mouse.buttons === RIGHT_CLICK) {
          // Éviter de créer une boite de sélection si on effectue un simple clic
          this.selectionBox.deleteSelectionBox();
          this.isInRectangleSelection(this.selectionRectangle.rectangleInverted);
          this.createBoundingBox();
        } else if (mouse.button === LEFT_CLICK ) {
          // Éviter de créer une boite de sélection si on effectue un simple clic
          this.deleteBoundingBox();
          this.isInRectangleSelection(this.selectionRectangle.rectangle);
          this.createBoundingBox();
        }
      }
    }
  }

  onMousePress(mouse: MouseEvent): void {
    if (!this.clickOnSelectionBox && !this.clickInSelectionBox) {
      this.selectionRectangle.mouseDown(mouse);
    } else {
      this.transformCommand = new TransformSvgService(this.selectedElements, this.sanitizer, this.deleteBoundingBox.bind(this));
    }
  }

  onMouseRelease(): void {
    this.selectionBox.controlPosition = ControlPosition.NONE;
    if (this.clickOnSelectionBox || this.clickInSelectionBox) {
      this.clickOnSelectionBox = false;
      this.clickInSelectionBox = false;
      if (this.transformCommand.hasMoved()) {
        this.command.execute(this.transformCommand);
      }
      this.command.drawingInProgress = false;
    } else {
        if (this.selectionRectangle.rectangle) {
          this.isInRectangleSelection(this.selectionRectangle.rectangle);
        } else if (this.selectionRectangle.rectangleInverted) {
          this.isInRectangleSelection(this.selectionRectangle.rectangleInverted);
        }
        this.createBoundingBox();
        this.selectionRectangle.mouseUp();
        this.selectionRectangle.rectangle = new RectangleService();
        this.selectionRectangle.rectangleInverted = new RectangleService();
        this.modifiedElement.clear();
    }
  }

  onMouseLeave(): void {
    this.selectionBox.controlPosition = ControlPosition.NONE;
  }

  createBoundingBox(): void {
    if (this.selectedElements.length !== 0) {
      let pointMin: Point = {x: this.drawingManager.width , y: this.drawingManager.height};
      let pointMax: Point = {x: 0 , y: 0};
      const epaisseurMin: Point = {x: 0, y: 0};
      const epaisseurMax: Point = {x: 0, y: 0};

      for (const element of this.selectedElements) {
        for (const point of element.points) {
              // pointMin
          const transformedX = element.transform.a * point.x + element.transform.c * point.y + element.transform.e;
          const transformedY = element.transform.b * point.x + element.transform.d * point.y + element.transform.f;
          if (transformedX < pointMin.x) {
            pointMin.x = transformedX;
            epaisseurMin.x = element.thickness ? element.thickness : 0;
          }
          if (transformedY < pointMin.y) {
            pointMin.y = transformedY;
            epaisseurMin.y = element.thickness ? element.thickness : 0;
          }

          // pointMax
          if (transformedX > pointMax.x) {
            pointMax.x = transformedX;
            epaisseurMax.x = element.thickness ? element.thickness : 0;
          }
          if (transformedY > pointMax.y) {
            pointMax.y = transformedY;
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
    // for (const element of this.selectedElements) {
      // element.isSelected = false;
    // }
    this.selectedElements = [];
  }

  isInRectangleSelection(rectangleSelection: RectangleService): void {
    this.findPointMinAndMax(rectangleSelection);

    for (const element of this.svgStockage.getCompleteSVG()) {
      this.findPointMinAndMax(element);

      if (this.selectionRectangle.rectangle) {
        if (this.belongToRectangle(element, this.selectionRectangle.rectangle) && !this.selectedElements.includes(element)) {
          // element.isSelected = true;
          this.selectedElements.push(element);
        } // else { element.isSelected = false; }
      } else if (this.selectionRectangle.rectangleInverted) {
        if (this.belongToRectangle(element, this.selectionRectangle.rectangleInverted) && !this.modifiedElement.has(element)) {
          this.reverseElementSelectionStatus(element);
          this.modifiedElement.add(element);
        } else if (!this.belongToRectangle(element, this.selectionRectangle.rectangleInverted) && this.modifiedElement.has(element) ) {
          this.reverseElementSelectionStatus(element);
          this.modifiedElement.delete(element);
        }
      }
    }
  }

  belongToRectangle(element: DrawElement, rectangle: RectangleService): boolean {
    // BOTTOM RIGHT corner of element with TOP LEFT corner of selection
    const topLeftCollision = element.pointMax.x >= rectangle.pointMin.x && element.pointMax.y >= rectangle.pointMin.y;
    // BOTTOM LEFT corner of element with TOP RIGHT corner of selection
    const topRightCollision = element.pointMin.x <= rectangle.pointMax.x && element.pointMax.y >= rectangle.pointMin.y;
    // TOP LEFT corner of element with BOTTOM RIGHT corner of selection
    const bottomRightCollision = element.pointMin.x <= rectangle.pointMax.x && element.pointMin.y <= rectangle.pointMax.y;
    // TOP RIGHT corner of element with BOTTOM LEFT corner of selection
    const bottomLeftCollision =  element.pointMax.x >= rectangle.pointMin.x && element.pointMin.y <= rectangle.pointMax.y;

    return (topLeftCollision && topRightCollision && bottomRightCollision && bottomLeftCollision);
  }

  findPointMinAndMax(element: DrawElement): void {
    const pointMin: Point = {x: this.drawingManager.width , y: this.drawingManager.height};
    const pointMax: Point = {x: 0 , y: 0};
    const epaisseurMin: Point = {x: 0, y: 0};
    const epaisseurMax: Point = {x: 0, y: 0};

    for (const point of element.points) {
      // pointMin
      const transformedX = element.transform.a * point.x + element.transform.c * point.y + element.transform.e;
      const transformedY = element.transform.b * point.x + element.transform.d * point.y + element.transform.f;
      if (transformedX < pointMin.x) {
        pointMin.x = transformedX;
        epaisseurMin.x = element.thickness ? element.thickness : 0;
      }
      if (transformedY < pointMin.y) {
        pointMin.y = transformedY;
        epaisseurMin.y = element.thickness ? element.thickness : 0;
      }

      // pointMax
      if (transformedX > pointMax.x) {
        pointMax.x = transformedX;
        epaisseurMax.x = element.thickness ? element.thickness : 0;
      }
      if (transformedY > pointMax.y) {
        pointMax.y = transformedY;
        epaisseurMax.y = element.thickness ? element.thickness : 0;
      }
    }
    element.pointMin = {x: pointMin.x - HALF_DRAW_ELEMENT * epaisseurMin.x, y: pointMin.y - HALF_DRAW_ELEMENT * epaisseurMin.y};
    element.pointMax = {x: pointMax.x + HALF_DRAW_ELEMENT * epaisseurMax.x, y: pointMax.y + HALF_DRAW_ELEMENT * epaisseurMax.y };
  }

  updateTranslation(x: number, y: number): void {
    if (this.selectionBox.box) {
      for (const element of this.selectedElements) {
          element.updateTranslation(x, y);
          element.svgHtml = this.sanitizer.bypassSecurityTrustHtml(element.svg);
      }
      this.selectionBox.updateTranslation(x, y);
    }
  }

  updateTranslationMouse(mouse: MouseEvent): void {
    if (this.selectionBox.box) {
      for (const element of this.selectedElements) {
          element.updateTranslationMouse(mouse);
          element.svgHtml = this.sanitizer.bypassSecurityTrustHtml(element.svg);
      }
      this.selectionBox.updateTranslationMouse(mouse);
    }
  }

  reverseElementSelectionStatus(element: DrawElement): void {
    if (!this.selectedElements.includes(element)) {
      this.selectedElements.push(element);
      // element.isSelected = true;
    } else {
      const index = this.selectedElements.indexOf(element, 0);
      this.selectedElements.splice(index, 1);
      // element.isSelected = false;
    }
  }

  resizeElements(mouse: MouseEvent): void {
    let resizeFactor = 0;
    switch (this.selectionBox.controlPosition) {
      case ControlPosition.UP:
        resizeFactor = 1 + (this.selectionBox.mouseClick.y - mouse.offsetY) / this.selectionBox.box.getHeight();
        break;
      case ControlPosition.DOWN:
        resizeFactor = 1 - (this.selectionBox.mouseClick.y - mouse.offsetY) / this.selectionBox.box.getHeight();
        break;
      case ControlPosition.LEFT:
        resizeFactor = 1 + (this.selectionBox.mouseClick.x - mouse.offsetX) / this.selectionBox.box.getWidth();
        break;
      case ControlPosition.RIGHT:
        resizeFactor = 1 - (this.selectionBox.mouseClick.x - mouse.offsetX) / this.selectionBox.box.getWidth();
        break;
    }
    console.log(resizeFactor);
    for (const element of this.selectedElements) {
      // TODO: redimensionner les éléments
    }
  }

}
