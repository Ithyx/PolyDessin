import { Component } from '@angular/core';
import { DessinManagerService } from 'src/app/services/dessin-manager/dessin-manager.service';
import { StockageSvgService } from 'src/app/services/stockage-svg.service';

@Component({
  selector: 'app-surface-dessin',
  templateUrl: './surface-dessin.component.html',
  styleUrls: ['./surface-dessin.component.scss']
})
export class SurfaceDessinComponent {
  constructor(public stockage: StockageSvgService, public gestionnaireDessin: DessinManagerService) { }
}
