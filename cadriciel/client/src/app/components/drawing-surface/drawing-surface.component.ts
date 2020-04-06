import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CanvasConversionService } from 'src/app/services/canvas-conversion.service';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { DrawElement, Point } from 'src/app/services/stockage-svg/draw-element/draw-element';
import { SVGStockageService } from 'src/app/services/stockage-svg/svg-stockage.service';
import { ColorChangerToolService } from 'src/app/services/tools/color-changer-tool.service';
import { EraserToolService } from 'src/app/services/tools/eraser-tool.service';
import { PipetteToolService } from 'src/app/services/tools/pipette-tool.service';
import { LEFT_CLICK, RIGHT_CLICK, SelectionService } from 'src/app/services/tools/selection/selection.service';
import { TOOL_INDEX, ToolManagerService } from 'src/app/services/tools/tool-manager.service';
import { TracePencilService } from 'src/app/services/stockage-svg/draw-element/trace/trace-pencil.service';

const BIG_ROTATION_ANGLE = 15;
const SMALL_ROTATION_ANGLE = 1;

@Component({
  selector: 'app-drawing-surface',
  templateUrl: './drawing-surface.component.html',
  styleUrls: ['./drawing-surface.component.scss']
})

export class DrawingSurfaceComponent implements AfterViewInit {
  @ViewChild('drawing', {static: false})
  private drawing: ElementRef<SVGElement>;
  private mousePosition: Point;
  @ViewChild('canvas', {static: false})
  private canvas: ElementRef<HTMLCanvasElement>;

  constructor(protected svgStockage: SVGStockageService,
              private tools: ToolManagerService,
              protected drawingManager: DrawingManagerService,
              private selection: SelectionService,
              protected grid: GridService,
              private colorChanger: ColorChangerToolService,
              private eraser: EraserToolService,
              private canvasConversion: CanvasConversionService,
              private pipette: PipetteToolService
              ) {
                 this.mousePosition = {x: 0, y: 0};
                }

  ngAfterViewInit(): void {
    this.eraser.drawing = this.drawing.nativeElement;
    this.pipette.drawing = this.drawing.nativeElement;
    this.canvasConversion.canvas = this.canvas.nativeElement;
    this.pipette.canvas = this.canvas.nativeElement;
  }

  clickBelongToSelectionBox(mouse: MouseEvent): boolean {
    const belongInX = mouse.offsetX >= this.selection.selectionBox.box.points[0].x
                    && mouse.offsetX <= this.selection.selectionBox.box.points[1].x;

    const belongInY = mouse.offsetY >= this.selection.selectionBox.box.points[0].y
                    && mouse.offsetY <= this.selection.selectionBox.box.points[1].y;

    return belongInX && belongInY;
  }

  handleElementMouseDown(element: DrawElement, mouse: MouseEvent): void {
    this.colorChanger.activeElement = element;
    this.mousePosition = {x: mouse.screenX, y: mouse.screenY};
    if (this.tools.activeTool.ID === TOOL_INDEX.SELECTION) {
      if (mouse.button === LEFT_CLICK) {
        if (!this.selection.selectedElements.includes(element)) {
          for (const elements of this.selection.selectedElements) {
            elements.isSelected = false;
          }
          this.selection.selectedElements.splice(0, this.selection.selectedElements.length);
          this.selection.selectedElements.push(element);
          element.isSelected = true;
          this.selection.createBoundingBox();
        }
        this.selection.selectionBox.mouseClick = {x: mouse.offsetX , y: mouse.offsetY };
        delete this.selection.selectionRectangle.rectangle;
        this.selection.clickInSelectionBox = true;
      } else if (mouse.button === RIGHT_CLICK) {
        this.selection.selectionRectangle.mouseDown(mouse);
        delete this.selection.selectionRectangle.rectangle;
      }
    }
  }

  handleElementMouseUp(element: DrawElement, mouse: MouseEvent): void {
    if (this.tools.activeTool.ID === TOOL_INDEX.SELECTION) {
      if (mouse.button === LEFT_CLICK) {
        if (this.mousePosition.x === mouse.screenX && this.mousePosition.y === mouse.screenY) {
          for (const elements of this.selection.selectedElements) {
            elements.isSelected = false;
          }
          this.selection.selectedElements.splice(0, this.selection.selectedElements.length);
          this.selection.selectedElements.push(element);
          element.isSelected = true;
          this.selection.createBoundingBox();
        }
      } else if (mouse.button === RIGHT_CLICK) {
        if (this.mousePosition.x === mouse.screenX && this.mousePosition.y === mouse.screenY) {
          this.handleElementRightClick(element);
        }
      }
    }
  }

  handleElementClick(element: DrawElement): void {
    this.colorChanger.activeElement = element;
    if (this.tools.activeTool.ID === TOOL_INDEX.SELECTION) {
      this.selection.handleClick(element);
      this.selection.clickOnSelectionBox = false;
      this.selection.clickInSelectionBox = false;
    }
  }

  handleElementRightClick(element: DrawElement): void {
    this.colorChanger.activeElement = element;
    if (this.tools.activeTool.ID === TOOL_INDEX.SELECTION) {
      this.selection.handleRightClick(element);
      this.selection.clickOnSelectionBox = false;
      this.selection.clickInSelectionBox = false;
    }
  }

  handleMouseDownBox(mouse: MouseEvent): void {
    if (this.tools.activeTool.ID === TOOL_INDEX.SELECTION) {
      this.selection.clickOnSelectionBox = true;
      this.selection.selectionBox.mouseClick = {x: mouse.offsetX , y: mouse.offsetY };
    }
  }

  handleMouseDownBackground(mouse: MouseEvent): void {
    this.mousePosition = {x: mouse.screenX, y: mouse.screenY};
    this.colorChanger.activeElement = undefined;
    if (this.tools.activeTool.ID === TOOL_INDEX.SELECTION) {
      if (mouse.button === LEFT_CLICK) {
        // si on clique dans la boite de selection d'un element SVG
        if (this.selection.selectionBox.box && this.clickBelongToSelectionBox(mouse)) {
          this.selection.selectionBox.mouseClick = {x: mouse.offsetX , y: mouse.offsetY };
          this.selection.clickInSelectionBox = true;
          delete this.selection.selectionRectangle.rectangle;

        } else {  // sinon on clique sur fond
          this.handleBackgroundLeftClick();
        }
      } else if (mouse.button === RIGHT_CLICK) {
        this.selection.selectionRectangle.mouseDown(mouse);
        delete this.selection.selectionRectangle.rectangle;
      }
    }
  }

  handleMouseUpBackground(mouse: MouseEvent): void {
    if (this.mousePosition.x === mouse.screenX && this.mousePosition.y === mouse.screenY && mouse.button === LEFT_CLICK) {
      this.handleBackgroundLeftClick();
    }
   }

   handleBackgroundLeftClick(): void {
    this.selection.deleteBoundingBox();
    this.selection.clickOnSelectionBox = false;
    this.selection.clickInSelectionBox = false;
    for (const element of this.selection.selectedElements) {
      element.isSelected = false;
    }
    this.selection.selectedElements.splice(0, this.selection.selectedElements.length);

   }

   handleControlPointMouseDown(mouse: MouseEvent): void {
    this.mousePosition = {x: mouse.screenX, y: mouse.screenY};
    if (this.tools.activeTool.ID === TOOL_INDEX.SELECTION && mouse.button === RIGHT_CLICK) {
      this.selection.selectionRectangle.mouseDown(mouse);
      delete this.selection.selectionRectangle.rectangle;
    }

   }

   @HostListener('mousewheel', ['$event']) onMousewheel(event: WheelEvent): void {
    if (this.tools.activeTool.ID === TOOL_INDEX.SELECTION && this.selection.selectedElements.length > 0) {
      event.preventDefault();
      if (event.shiftKey) {
        // Rotation de tous les éléments autour de leur propre point central
        for (const element of this.selection.selectedElements) {
          if (element.hasMoved) {
            this.selection.findPointMinAndMax(element);
            element.hasMoved = false;
          }
          const middleX = (element.pointMin.x + element.pointMax.x) / 2;
          const middleY = (element.pointMin.y + element.pointMax.y) / 2;
          event.deltaY > 0 ? (
          event.altKey ? element.updateRotation(middleX, middleY, SMALL_ROTATION_ANGLE) :
                         element.updateRotation(middleX, middleY, BIG_ROTATION_ANGLE)) :
          event.altKey ? element.updateRotation(middleX, middleY, -SMALL_ROTATION_ANGLE) :
                         element.updateRotation(middleX, middleY, -BIG_ROTATION_ANGLE);
          element.svgHtml = this.selection.sanitizer.bypassSecurityTrustHtml(element.svg);
        }

      } else {
        // Rotation de tous les éléments autour du même point central
        if (this.selection.selectionBox.box.hasMoved) {
          this.selection.findPointMinAndMax(this.selection.selectionBox.box);
          this.selection.selectionBox.box.hasMoved = false;
        }
        const middleX = (this.selection.selectionBox.box.pointMin.x + this.selection.selectionBox.box.pointMax.x ) / 2;
        const middleY = (this.selection.selectionBox.box.pointMin.y + this.selection.selectionBox.box.pointMax.y ) / 2;
        for (const element of this.selection.selectedElements) {
          event.deltaY > 0 ? (
            event.altKey ? element.updateRotation(middleX, middleY, SMALL_ROTATION_ANGLE) :
                           element.updateRotation(middleX, middleY, BIG_ROTATION_ANGLE)) :
            event.altKey ? element.updateRotation(middleX, middleY, -SMALL_ROTATION_ANGLE) :
                           element.updateRotation(middleX, middleY, -BIG_ROTATION_ANGLE);
          element.svgHtml = this.selection.sanitizer.bypassSecurityTrustHtml(element.svg);
        }
      }
    }
   }
}
