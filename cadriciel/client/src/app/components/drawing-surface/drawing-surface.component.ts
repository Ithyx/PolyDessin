import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ColorParameterService } from 'src/app/services/color/color-parameter.service';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { RoutingManagerService } from 'src/app/services/routing-manager.service';
import { DrawElement } from 'src/app/services/stockage-svg/draw-element';
import { RectangleService } from 'src/app/services/stockage-svg/rectangle.service';
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
  constructor(public SVGStockage: SVGStockageService,
              public tools: ToolManagerService,
              public drawingManager: DrawingManagerService,
              public routingManager: RoutingManagerService,
              public routing: Router,
              public colorParameter: ColorParameterService,
              public selection: SelectionService,
              public grid: GridService,
              public colorChanger: ColorChangerToolService) {
  }

  handleBackgroundClick(mouse: MouseEvent): void {
    if (this.tools.activeTool.ID === TOOL_INDEX.SELECTION) {
      if (this.selection.selectionBox.selectionBox &&
          this.isInSelectionBox(mouse, this.selection.selectionBox.selectionBox)) {
         this.selection.clickInSelectionBox = true;
         this.handleMouseDown(mouse);
        }
      } else {
        this.selection.deleteBoundingBox();
        this.selection.clickInSelectionBox = false;
        this.selection.clickOnSelectionBox = false;
        for (const element of this.selection.selectedElements) {
          element.isSelected = false;
        }
        this.selection.selectedElements.splice(0, this.selection.selectedElements.length);
      }
  }

  isInSelectionBox(mouse: MouseEvent, svg: RectangleService): boolean {
    this.selection.findPointMinAndMax(svg);
    const isInSelectionBoxX = svg.pointMin.x < mouse.offsetX && svg.pointMax.x > mouse.offsetX;
    const isInSelectionBoxY = svg.pointMin.y < mouse.offsetY && svg.pointMax.y > mouse.offsetY;
    return isInSelectionBoxX && isInSelectionBoxY;
  }

  handleBackgroundRightClick(): boolean {
    return false;
  }

  handleElementClick(element: DrawElement): void {
    this.colorChanger.activeElementID = this.SVGStockage.getCompleteSVG().indexOf(element);
    if (this.tools.activeTool.ID === TOOL_INDEX.SELECTION) {
      this.selection.handleClick(element);
      this.selection.clickOnSelectionBox = false;
    }
  }

  handleElementRightClick(element: DrawElement): boolean {
    this.colorChanger.activeElementID = this.SVGStockage.getCompleteSVG().indexOf(element);
    if (this.tools.activeTool.ID === TOOL_INDEX.SELECTION) {
      this.selection.handleRightClick(element);
      this.selection.clickOnSelectionBox = false;
    } else if (this.tools.activeTool.ID === TOOL_INDEX.COLOR_CHANGER) {
      this.colorChanger.onRightClick();
    }
    return false;
  }

  handleMouseDown(event: MouseEvent): void {
    if (this.tools.activeTool.ID === TOOL_INDEX.SELECTION) {
      this.selection.clickOnSelectionBox = true;
      this.selection.selectionBox.mouseClick = {x: event.offsetX , y: event.offsetY };
    }
  }

  handleMouseUp(event: MouseEvent): void {
   if (this.tools.activeTool.ID === TOOL_INDEX.SELECTION) {
     this.selection.selectionBox.selectionBox.translateAllPoints();
     for (const controlPoint of this.selection.selectionBox.controlPointBox) {
       controlPoint.translateAllPoints();
     }
   }
  }

}
