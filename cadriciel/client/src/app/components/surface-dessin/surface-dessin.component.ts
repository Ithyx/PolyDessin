import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ColorParameterService } from 'src/app/services/couleur/color-parameter.service'
import { GestionnaireDessinService } from 'src/app/services/gestionnaire-dessin/gestionnaire-dessin.service';
import { GestionnaireRoutingService } from 'src/app/services/gestionnaire-routing.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { ToolManagerService, SELECTION_TOOL_INDEX } from 'src/app/services/outils/tool-manager.service';
import { SelectionService } from 'src/app/services/outils/selection/selection.service';
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
              public gestionnaireDessin: GestionnaireDessinService,
              public navigation: GestionnaireRoutingService,
              public routing: Router,
              public colorParameter: ColorParameterService,
              public selection: SelectionService,
              public grid: GridService) {
    if (colorParameter.backgroundColor === undefined) {
      routing.navigate([navigation.pagePrecedente]);
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
