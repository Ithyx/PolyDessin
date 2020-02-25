import { Injectable } from '@angular/core';
import { SVGStockageService } from 'src/app/services/stockage-svg/svg-stockage.service';
import { DrawElement } from '../stockage-svg/draw-element';
import { Commande } from './commande';

@Injectable({
  providedIn: 'root'
})
export class AjoutSvgService implements Commande {
  cleSVG: number;
  constructor(public element: DrawElement,
              public SVGStockage: SVGStockageService) {
    this.SVGStockage.addSVG(this.element);
    this.cleSVG = this.SVGStockage.size;
  }

  annuler() {
    const element = this.SVGStockage.removeSVG(this.cleSVG);
    if (element) {
      this.element = element;
    }
  }

  refaire() {
    if (this.element) {
      this.SVGStockage.addSVG(this.element, this.cleSVG);
    }
  }
}
