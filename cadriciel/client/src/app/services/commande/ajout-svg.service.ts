import { Injectable } from '@angular/core';
import { StockageSvgService } from 'src/app/services/stockage-svg/stockage-svg.service';
import { ElementDessin } from '../../../../../common/communication/element-dessin';
import { Commande } from './commande';

@Injectable({
  providedIn: 'root'
})
export class AjoutSvgService implements Commande {
  cleSVG: number;
  constructor(public element: ElementDessin,
              public stockageSVG: StockageSvgService) {
    this.stockageSVG.ajouterSVG(this.element);
    this.cleSVG = this.stockageSVG.taille;
  }

  annuler() {
    const element = this.stockageSVG.retirerSVG(this.cleSVG);
    if (element) {
      this.element = element;
    }
  }

  refaire() {
    if (this.element) {
      this.stockageSVG.ajouterSVG(this.element, this.cleSVG);
    }
  }
}
