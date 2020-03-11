import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ColorParameterService } from 'src/app/services/color/color-parameter.service';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { RoutingManagerService } from 'src/app/services/routing-manager.service';
import { DrawElement } from 'src/app/services/stockage-svg/draw-element';
import { SVGStockageService } from 'src/app/services/stockage-svg/svg-stockage.service';
import { ColorChangerToolService } from 'src/app/services/tools/color-changer-tool.service';
import { SelectionService } from 'src/app/services/tools/selection/selection.service';
import { TOOL_INDEX, ToolManagerService } from 'src/app/services/tools/tool-manager.service';

@Component({
  selector: 'app-drawing-surface',
  templateUrl: './drawing-surface.component.html',
  styleUrls: ['./drawing-surface.component.scss']
})
export class DrawingSurfaceComponent {
  constructor(private SVGStockage: SVGStockageService,
              private tools: ToolManagerService,
              public drawingManager: DrawingManagerService,
              public routingManager: RoutingManagerService,
              public routing: Router,
              public colorParameter: ColorParameterService,
              private selection: SelectionService,
              public grid: GridService,
              private colorChanger: ColorChangerToolService) {
  }

  clickBelongToSelectionBox(mouse: MouseEvent): boolean {
    const belongInX = mouse.offsetX >= this.selection.selectionBox.selectionBox.points[0].x
                    && mouse.offsetX <= this.selection.selectionBox.selectionBox.points[1].x;

    const belongInY = mouse.offsetY >= this.selection.selectionBox.selectionBox.points[0].y
                    && mouse.offsetY <= this.selection.selectionBox.selectionBox.points[1].y;

    return belongInX && belongInY;
  }

  handleBackgroundRightClick(): boolean {
    return false;
  }

  handleElementClick(element: DrawElement): void {
    this.colorChanger.activeElementID = this.SVGStockage.getCompleteSVG().indexOf(element);
    if (this.tools.activeTool.ID === TOOL_INDEX.SELECTION) {
      this.selection.handleClick(element);
      this.selection.clickOnSelectionBox = false;
      this.selection.clickInSelectionBox = false;
    }
  }

  handleElementRightClick(element: DrawElement): boolean {
    this.colorChanger.activeElementID = this.SVGStockage.getCompleteSVG().indexOf(element);
    if (this.tools.activeTool.ID === TOOL_INDEX.SELECTION) {
      this.selection.handleRightClick(element);
      this.selection.clickOnSelectionBox = false;
      this.selection.clickInSelectionBox = false;
    } else if (this.tools.activeTool.ID === TOOL_INDEX.COLOR_CHANGER) {
      this.colorChanger.onRightClick();
    }
    return false;
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
    if (this.tools.activeTool.ID === TOOL_INDEX.SELECTION) {
      // si on clique dans la boite de selection d'un element SVG
      if (this.selection.selectionBox.selectionBox && this.clickBelongToSelectionBox(mouse)) {
        this.selection.selectionBox.mouseClick = {x: mouse.offsetX , y: mouse.offsetY };
        this.selection.clickInSelectionBox = true;
        delete this.selection.selectionRectangle.rectangle;

      } else {  // sinon on clique sur fond
        this.selection.deleteBoundingBox();
        this.selection.clickOnSelectionBox = false;
        this.selection.clickInSelectionBox = false;
        for (const element of this.selection.selectedElements) {
          element.isSelected = false;
        }
        this.selection.selectedElements.splice(0, this.selection.selectedElements.length);
      }
    }
  }

  handleMouseUpBackground(): void {
    if (this.tools.activeTool.ID === TOOL_INDEX.SELECTION) {
      this.selection.selectionBox.selectionBox.translateAllPoints();
      for (const controlPoint of this.selection.selectionBox.controlPointBox) {
        controlPoint.translateAllPoints();
      }
    }
   }

}
