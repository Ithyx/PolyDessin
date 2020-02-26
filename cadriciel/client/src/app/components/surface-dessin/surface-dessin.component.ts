import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ColorParameterService } from 'src/app/services/color/color-parameter.service'
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { SelectionService } from 'src/app/services/outils/selection/selection.service';
import { SELECTION_TOOL_INDEX, ToolManagerService } from 'src/app/services/outils/tool-manager.service';
import { RoutingManagerService } from 'src/app/services/routing-manager.service';
import { DrawElement } from 'src/app/services/stockage-svg/draw-element';
import { SVGStockageService } from 'src/app/services/stockage-svg/svg-stockage.service';

@Component({
  selector: 'app-surface-dessin',
  templateUrl: './surface-dessin.component.html',
  styleUrls: ['./surface-dessin.component.scss']
})
export class SurfaceDessinComponent {
  constructor(public SVGStockage: SVGStockageService,
              public outils: ToolManagerService,
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

  traiterClicSurVide() {
    if (this.outils.activeTool.ID === SELECTION_TOOL_INDEX) {
      if (!this.selection.selectionRectangle.rectangle) {
        console.log('clic sur vide');
        this.selection.deleteBoundingBox();
      }
    }
  }

  traiterClicElementDessin(element: DrawElement) {
    // TODO : Vérification de l'outil (Selection, Pipette, Applicateur de Couleur)
    if (this.outils.activeTool.ID === SELECTION_TOOL_INDEX) {
      this.selection.traiterClic(element);
    }
  }
}
