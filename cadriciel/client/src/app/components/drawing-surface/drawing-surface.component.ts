import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ColorParameterService } from 'src/app/services/color/color-parameter.service';
import { CommandManagerService } from 'src/app/services/command/command-manager.service';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { RoutingManagerService } from 'src/app/services/routing-manager.service';
import { DrawElement } from 'src/app/services/stockage-svg/draw-element';
import { SVGStockageService } from 'src/app/services/stockage-svg/svg-stockage.service';
import { ColorChangerToolService } from 'src/app/services/tools/color-changer-tool.service';
import { EraserToolService } from 'src/app/services/tools/eraser-tool.service';
import { SelectionService } from 'src/app/services/tools/selection/selection.service';
import { TOOL_INDEX, ToolManagerService } from 'src/app/services/tools/tool-manager.service';

const LEFT_CLICK = 0;
const RIGHT_CLICK = 2;

@Component({
  selector: 'app-drawing-surface',
  templateUrl: './drawing-surface.component.html',
  styleUrls: ['./drawing-surface.component.scss']
})
export class DrawingSurfaceComponent implements AfterViewInit {
  @ViewChild('drawing', {static: false})
  drawing: ElementRef<SVGElement>;
  mousePositionX: number;
  mousePositionY: number;

  constructor(public SVGStockage: SVGStockageService,
              private tools: ToolManagerService,
              public drawingManager: DrawingManagerService,
              public routingManager: RoutingManagerService,
              public routing: Router,
              public colorParameter: ColorParameterService,
              private selection: SelectionService,
              public grid: GridService,
              public colorChanger: ColorChangerToolService,
              public commands: CommandManagerService,
              public eraser: EraserToolService) {
                 this.mousePositionX = 0;
                 this.mousePositionY = 0;
  }

  ngAfterViewInit(): void {
    this.eraser.drawing = this.drawing.nativeElement;
  }

  clickBelongToSelectionBox(mouse: MouseEvent): boolean {
    const belongInX = mouse.offsetX >= this.selection.selectionBox.selectionBox.points[0].x
                    && mouse.offsetX <= this.selection.selectionBox.selectionBox.points[1].x;

    const belongInY = mouse.offsetY >= this.selection.selectionBox.selectionBox.points[0].y
                    && mouse.offsetY <= this.selection.selectionBox.selectionBox.points[1].y;

    return belongInX && belongInY;
  }

  handleElementMouseDown(element: DrawElement, mouse: MouseEvent): void {
    this.mousePositionX = mouse.screenX;
    this.mousePositionY = mouse.screenY;
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

      }
    }
  }

  handleElementMouseUp(element: DrawElement, mouse: MouseEvent): void {
    if (mouse.button === LEFT_CLICK) {
      if (this.mousePositionX === mouse.screenX && this.mousePositionY === mouse.screenY) {
        for (const elements of this.selection.selectedElements) {
          elements.isSelected = false;
        }
        this.selection.selectedElements.splice(0, this.selection.selectedElements.length);
        this.selection.selectedElements.push(element);
        element.isSelected = true;
        this.selection.createBoundingBox();
      }
    } else if (mouse.button === RIGHT_CLICK) {
      if (this.mousePositionX === mouse.screenX && this.mousePositionY === mouse.screenY) {
        this.handleElementRightClick(element);
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

  handleMouseUpBox(): void {
   if (this.tools.activeTool.ID === TOOL_INDEX.SELECTION) {
     this.selection.selectionBox.selectionBox.translateAllPoints();
     for (const controlPoint of this.selection.selectionBox.controlPointBox) {
       controlPoint.translateAllPoints();
     }
   }
  }

  handleMouseDownBackground(mouse: MouseEvent): void {
    this.mousePositionX = mouse.screenX;
    this.mousePositionY = mouse.screenY;
    this.colorChanger.activeElement = undefined;
    if (this.tools.activeTool.ID === TOOL_INDEX.SELECTION) {
      if (mouse.button === LEFT_CLICK) {
        // si on clique dans la boite de selection d'un element SVG
        if (this.selection.selectionBox.selectionBox && this.clickBelongToSelectionBox(mouse)) {
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
    if (mouse.button === LEFT_CLICK) {
      if (this.mousePositionX === mouse.screenX && this.mousePositionY === mouse.screenY) {
        this.handleBackgroundLeftClick();
      }
      if (this.tools.activeTool.ID === TOOL_INDEX.SELECTION) {
        if (this.selection.selectedElements.length !== 0) {
          this.selection.selectionBox.selectionBox.translateAllPoints();
          for (const controlPoint of this.selection.selectionBox.controlPointBox) {
            controlPoint.translateAllPoints();
          }
        }
      }
    }
    else if (mouse.button === RIGHT_CLICK) {
      // TODO : Utile de spécifié le click ?
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

}
