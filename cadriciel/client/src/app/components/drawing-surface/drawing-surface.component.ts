import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ColorParameterService } from 'src/app/services/color/color-parameter.service'
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { RoutingManagerService } from 'src/app/services/routing-manager.service';
import { DrawElement } from 'src/app/services/stockage-svg/draw-element';
import { SVGStockageService } from 'src/app/services/stockage-svg/svg-stockage.service';
import { SelectionService } from 'src/app/services/tools/selection/selection.service';
import { SELECTION_TOOL_INDEX, ToolManagerService } from 'src/app/services/tools/tool-manager.service';

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
              public grid: GridService) {
    if (colorParameter.backgroundColor === undefined) {
      routing.navigate([routingManager.previousPage]);
    }
  }

  handleBackgroundClick() {
    if (this.tools.activeTool.ID === SELECTION_TOOL_INDEX) {
      if (!this.selection.selectionRectangle.rectangle) {
        this.selection.deleteBoundingBox();
      }
    }
  }

  handleElementClick(element: DrawElement) {
    // TODO : Vérification de l'outil (Selection, Pipette, Applicateur de Couleur)
    if (this.tools.activeTool.ID === SELECTION_TOOL_INDEX) {
      this.selection.traiterClic(element);
    }
  }
}
