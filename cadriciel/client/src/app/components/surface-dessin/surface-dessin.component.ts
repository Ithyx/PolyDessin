import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ParametresCouleurService } from 'src/app/services/couleur/parametres-couleur.service'
import { GestionnaireDessinService } from 'src/app/services/gestionnaire-dessin/gestionnaire-dessin.service';
import { GestionnaireRoutingService } from 'src/app/services/gestionnaire-routing.service';
import { SelectionService } from 'src/app/services/outils/selection.service';
import { StockageSvgService } from 'src/app/services/stockage-svg/stockage-svg.service';

@Component({
  selector: 'app-surface-dessin',
  templateUrl: './surface-dessin.component.html',
  styleUrls: ['./surface-dessin.component.scss']
})
export class SurfaceDessinComponent {
  constructor(public stockage: StockageSvgService,
              public gestionnaireDessin: GestionnaireDessinService,
              public navigation: GestionnaireRoutingService,
              public routing: Router,
              public parametresCouleur: ParametresCouleurService,
              public selection: SelectionService) {
    if (parametresCouleur.couleurFond === undefined) {
      routing.navigate([navigation.pagePrecedente]);
    }
  }

  sourisCliquee(evenement: MouseEvent, cle: number) {
    this.selection.sourisCliquee(evenement, cle);
  }
}
