import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DessinManagerService } from 'src/app/services/dessin-manager/dessin-manager.service';
import { GestionnaireRoutingService } from 'src/app/services/gestionnaire-routing.service';
import { StockageSvgService } from 'src/app/services/stockage-svg.service';

@Component({
  selector: 'app-surface-dessin',
  templateUrl: './surface-dessin.component.html',
  styleUrls: ['./surface-dessin.component.scss']
})
export class SurfaceDessinComponent {
  constructor(public stockage: StockageSvgService,
              public gestionnaireDessin: DessinManagerService,
              public navigation: GestionnaireRoutingService,
              public routing: Router) {
    if (gestionnaireDessin.couleur === undefined) {
      routing.navigate([navigation.pagePrecedante]);
    }
  }
}
