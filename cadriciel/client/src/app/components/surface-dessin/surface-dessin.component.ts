import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ParametresCouleurService } from 'src/app/services/couleur/parametres-couleur.service'
import { GestionnaireDessinService } from 'src/app/services/gestionnaire-dessin/gestionnaire-dessin.service';
import { GestionnaireRoutingService } from 'src/app/services/gestionnaire-routing.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { GestionnaireOutilsService, INDEX_OUTIL_SELECTION } from 'src/app/services/outils/gestionnaire-outils.service';
import { SelectionService } from 'src/app/services/outils/selection/selection.service';
import { StockageSvgService } from 'src/app/services/stockage-svg/stockage-svg.service';
import { ElementDessin } from '../../services/stockage-svg/element-dessin';

@Component({
  selector: 'app-surface-dessin',
  templateUrl: './surface-dessin.component.html',
  styleUrls: ['./surface-dessin.component.scss']
})
export class SurfaceDessinComponent {
  constructor(public stockageSVG: StockageSvgService,
              public outils: GestionnaireOutilsService,
              public gestionnaireDessin: GestionnaireDessinService,
              public navigation: GestionnaireRoutingService,
              public routing: Router,
              public parametresCouleur: ParametresCouleurService,
              public selection: SelectionService,
              public grid: GridService) {
    if (parametresCouleur.couleurFond === undefined) {
      routing.navigate([navigation.pagePrecedente]);
    }
  }

  traiterClicSurVide() {
    if (this.outils.outilActif.ID === INDEX_OUTIL_SELECTION) {
      if (!this.selection.selectionRectangle.rectangle) {
        console.log('clic sur vide');
        this.selection.supprimerBoiteEnglobante();
      }
    }
  }

  traiterClicElementDessin(element: ElementDessin) {
    // TODO : Vérification de l'outil (Selection, Pipette, Applicateur de Couleur)
    if (this.outils.outilActif.ID === INDEX_OUTIL_SELECTION) {
      this.selection.traiterClic(element);
    }
  }
}
