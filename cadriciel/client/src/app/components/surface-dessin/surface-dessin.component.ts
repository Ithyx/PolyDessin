import { Component } from '@angular/core';
import { StockageSvgService } from 'src/app/services/stockage-svg.service';

@Component({
  selector: 'app-surface-dessin',
  templateUrl: './surface-dessin.component.html',
  styleUrls: ['./surface-dessin.component.scss']
})
export class SurfaceDessinComponent {
  longueur = 1000;
  hauteur = 1000;
  couleurFond = 'white';

  constructor(public stockage: StockageSvgService) { }
}
