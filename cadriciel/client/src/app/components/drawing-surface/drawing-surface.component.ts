import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CanvasConversionService } from 'src/app/services/canvas-conversion.service';
import { CommandManagerService } from 'src/app/services/command/command-manager.service';
import { TransformSvgService } from 'src/app/services/command/transform-svg.service';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { DrawElement, Point } from 'src/app/services/stockage-svg/draw-element/draw-element';
import { SVGStockageService } from 'src/app/services/stockage-svg/svg-stockage.service';
import { ColorChangerToolService } from 'src/app/services/tools/color-changer-tool.service';
import { EraserToolService } from 'src/app/services/tools/eraser-tool.service';
import { PaintBucketToolService } from 'src/app/services/tools/paint-bucket-tool.service';
import { PipetteToolService } from 'src/app/services/tools/pipette-tool.service';
import { LEFT_CLICK, RIGHT_CLICK, SelectionService } from 'src/app/services/tools/selection/selection.service';
import { TOOL_INDEX, ToolManagerService } from 'src/app/services/tools/tool-manager.service';

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
  @ViewChild('canvasConversion', {static: false})
  private conversion: ElementRef<HTMLCanvasElement>;

  constructor(protected svgStockage: SVGStockageService,
              private tools: ToolManagerService,
              protected drawingManager: DrawingManagerService,
              private selection: SelectionService,
              protected grid: GridService,
              private colorChanger: ColorChangerToolService,
              private eraser: EraserToolService,
              private canvasConversion: CanvasConversionService,
              private pipette: PipetteToolService,
              private commands: CommandManagerService,
              private bucket: PaintBucketToolService
              ) {
                 this.mousePosition = {x: 0, y: 0};
                }

  ngAfterViewInit(): void {
    this.eraser.drawing = this.drawing.nativeElement;
    this.pipette.drawing = this.drawing.nativeElement;
    this.bucket.drawing = this.drawing.nativeElement;
    this.canvasConversion.canvas = this.conversion.nativeElement;
    this.pipette.canvas = this.canvas.nativeElement;
    this.bucket.canvas = this.canvas.nativeElement;
  }

  clickBelongToSelectionBox(mouse: MouseEvent): boolean {
    this.selection.findPointMinAndMax(this.selection.selectionBox.box);
    const belongInX = mouse.offsetX >= this.selection.selectionBox.box.pointMin.x
                    && mouse.offsetX <= this.selection.selectionBox.box.pointMax.x;

    const belongInY = mouse.offsetY >= this.selection.selectionBox.box.pointMin.y
                    && mouse.offsetY <= this.selection.selectionBox.box.pointMax.y;

    return belongInX && belongInY;
  }

  handleElementMouseDown(element: DrawElement, mouse: MouseEvent): void {
    this.colorChanger.activeElement = element;
    this.mousePosition = {x: mouse.screenX, y: mouse.screenY};
    if (this.tools.activeTool.ID === TOOL_INDEX.SELECTION) {
      if (mouse.button === LEFT_CLICK) {
        if (!this.selection.selectedElements.includes(element)) {
          this.selection.selectedElements.splice(0, this.selection.selectedElements.length);
          this.selection.selectedElements.push(element);
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
          this.selection.selectedElements.splice(0, this.selection.selectedElements.length);
          this.selection.selectedElements.push(element);
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
    this.selection.selectedElements.splice(0, this.selection.selectedElements.length);

   }

   handleControlPointMouseDown(mouse: MouseEvent, index: number): void {
    this.mousePosition = {x: mouse.screenX, y: mouse.screenY};
    if (this.tools.activeTool.ID === TOOL_INDEX.SELECTION) {
      if (mouse.button === RIGHT_CLICK) {
        this.selection.selectionRectangle.mouseDown(mouse);
        delete this.selection.selectionRectangle.rectangle;
      } else if (mouse.button === LEFT_CLICK) {
        this.selection.selectionBox.controlPointMouseDown(mouse, index);
      }
    }

   }

   @HostListener('mousewheel', ['$event']) onMousewheel(event: WheelEvent): void {
    if (this.tools.activeTool.ID === TOOL_INDEX.SELECTION && this.selection.selectedElements.length > 0) {
      event.preventDefault();
      const transformCommand = new TransformSvgService(
        this.selection.selectedElements, this.selection.sanitizer, this.selection.deleteBoundingBox.bind(this.selection)
      );
      if (event.shiftKey) {
        // Rotation de tous les éléments autour de leur propre point central
        for (const element of this.selection.selectedElements) {

          this.selection.findPointMinAndMax(element);
          const middleX = (element.pointMin.x + element.pointMax.x) / 2;
          const middleY = (element.pointMin.y + element.pointMax.y) / 2;
          event.deltaY > 0 ? (
          event.altKey ? element.updateRotation(middleX, middleY, SMALL_ROTATION_ANGLE) :
                         element.updateRotation(middleX, middleY, BIG_ROTATION_ANGLE)) :
          event.altKey ? element.updateRotation(middleX, middleY, -SMALL_ROTATION_ANGLE) :
                         element.updateRotation(middleX, middleY, -BIG_ROTATION_ANGLE);
          element.svgHtml = this.selection.sanitizer.bypassSecurityTrustHtml(element.svg);
        }
        this.selection.selectionBox.deleteSelectionBox();
        this.selection.createBoundingBox();

      } else {
        // Rotation de tous les éléments autour du même point central
        this.selection.findPointMinAndMax(this.selection.selectionBox.box);
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
        this.selection.selectionBox.deleteSelectionBox();
        this.selection.createBoundingBox();
      }
      this.commands.execute(transformCommand);
    }
   }
}
