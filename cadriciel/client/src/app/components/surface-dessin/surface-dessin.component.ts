import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ParametresCouleurService } from 'src/app/services/couleur/parametres-couleur.service'
import { GestionnaireDessinService } from 'src/app/services/gestionnaire-dessin/gestionnaire-dessin.service';
import { GestionnaireRoutingService } from 'src/app/services/gestionnaire-routing.service';
import { GestionnaireOutilsService, INDEX_OUTIL_SELECTION } from 'src/app/services/outils/gestionnaire-outils.service';
import { SelectionService } from 'src/app/services/outils/selection/selection.service';
import { ElementDessin } from 'src/app/services/stockage-svg/element-dessin';
import { StockageSvgService } from 'src/app/services/stockage-svg/stockage-svg.service';

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
              public selection: SelectionService) {
    if (parametresCouleur.couleurFond === undefined) {
      routing.navigate([navigation.pagePrecedente]);
    }
  }

  traiterClicSurVide() {
    console.log('clic sur vide');
    this.selection.supprimerBoiteEnglobante();
  }

  traiterClicElementDessin(element: ElementDessin) {
    // TODO : Vérification de l'outil (Selection, Pipette, Applicateur de Couleur)
    if (this.outils.outilActif.ID === INDEX_OUTIL_SELECTION) {
      this.selection.traiterClic(element);
    }
  }
}
