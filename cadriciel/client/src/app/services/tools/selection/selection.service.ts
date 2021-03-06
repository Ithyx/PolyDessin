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

const HALF_DRAW_ELEMENT = 0.5;

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
    this.selectedElements.splice(0, this.selectedElements.length);
    this.selectedElements.push(drawElement);
    this.createBoundingBox();
  }

  handleRightClick(element: DrawElement): void {
    if (this.selectedElements.includes(element)) {
      const index = this.selectedElements.indexOf(element, 0);
      this.selectedElements.splice(index, 1);
      if (this.selectedElements.length === 0) {
        this.deleteBoundingBox();
      } else {
        this.createBoundingBox();
      }
    } else {
      this.selectedElements.push(element);
      this.createBoundingBox();
    }
  }

  onMouseMove(mouse: MouseEvent): void {
    if (this.selectionBox.controlPosition !== ControlPosition.NONE) {
      this.resizeElements(mouse);
      this.selectionBox.mouseClick = {x: mouse.offsetX, y: mouse.offsetY};
      this.createBoundingBox();
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
    if (!this.clickOnSelectionBox && !this.clickInSelectionBox && this.selectionBox.controlPosition === ControlPosition.NONE) {
      this.selectionRectangle.mouseDown(mouse);
    } else {
      this.command.drawingInProgress = true;
      this.transformCommand = new TransformSvgService(this.selectedElements, this.sanitizer, this.deleteBoundingBox.bind(this));
    }
  }

  onMouseRelease(): void {
    if (this.clickOnSelectionBox || this.clickInSelectionBox || this.selectionBox.controlPosition !== ControlPosition.NONE) {
      this.clickOnSelectionBox = false;
      this.clickInSelectionBox = false;
      if (this.transformCommand.hasMoved()) {
        this.command.execute(this.transformCommand);
      }
      this.command.drawingInProgress = false;
      this.selectionBox.controlPosition = ControlPosition.NONE;
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
    if (this.selectionBox.controlPosition !== ControlPosition.NONE && this.transformCommand.hasMoved()) {
      this.command.execute(this.transformCommand);
      this.transformCommand = new TransformSvgService(this.selectedElements, this.sanitizer, this.deleteBoundingBox.bind(this));
    }
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
    this.selectedElements = [];
  }

  isInRectangleSelection(rectangleSelection: RectangleService): void {
    this.findPointMinAndMax(rectangleSelection);

    for (const element of this.svgStockage.getCompleteSVG()) {
      this.findPointMinAndMax(element);

      if (this.selectionRectangle.rectangle) {
        if (this.belongToRectangle(element, this.selectionRectangle.rectangle) && !this.selectedElements.includes(element)) {
          this.selectedElements.push(element);
        }
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
    } else {
      const index = this.selectedElements.indexOf(element, 0);
      this.selectedElements.splice(index, 1);
    }
  }

  resizeElements(mouse: MouseEvent): void {
    const scale: Point = {x: 1, y: 1};
    switch (this.selectionBox.controlPosition) {
      case ControlPosition.UP:
        scale.y = 1 + (this.selectionBox.mouseClick.y - mouse.offsetY) / this.selectionBox.box.getHeight();
        if (scale.y < 0) {
          this.selectionBox.controlPosition = ControlPosition.DOWN;
          this.selectionBox.mouseClick = {...this.selectionBox.scaleCenter};
        }
        break;
      case ControlPosition.DOWN:
        scale.y = 1 - (this.selectionBox.mouseClick.y - mouse.offsetY) / this.selectionBox.box.getHeight();
        if (scale.y < 0) {
          this.selectionBox.controlPosition = ControlPosition.UP;
          this.selectionBox.mouseClick = {...this.selectionBox.scaleCenter};
        }
        break;
      case ControlPosition.LEFT:
        scale.x = 1 + (this.selectionBox.mouseClick.x - mouse.offsetX) / this.selectionBox.box.getWidth();
        if (scale.x < 0) {
          this.selectionBox.controlPosition = ControlPosition.RIGHT;
          this.selectionBox.mouseClick = {...this.selectionBox.scaleCenter};
        }
        break;
      case ControlPosition.RIGHT:
        scale.x = 1 - (this.selectionBox.mouseClick.x - mouse.offsetX) / this.selectionBox.box.getWidth();
        if (scale.x < 0) {
          this.selectionBox.controlPosition = ControlPosition.LEFT;
          this.selectionBox.mouseClick = {...this.selectionBox.scaleCenter};
        }
        break;
    }
    for (const element of this.selectedElements) {
      element.updateScale(scale, {...this.selectionBox.scaleCenter});
      this.findPointMinAndMax(element);
      element.draw();
      element.svgHtml = this.sanitizer.bypassSecurityTrustHtml(element.svg);
    }
  }

}
