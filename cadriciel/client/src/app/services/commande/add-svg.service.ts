import { Injectable } from '@angular/core';
import { SVGStockageService } from 'src/app/services/stockage-svg/svg-stockage.service';
import { DrawElement } from '../stockage-svg/draw-element';
import { Commande } from './commande';

@Injectable({
  providedIn: 'root'
})
export class AddSVGService implements Commande {
  SVGKey: number;
  constructor(public element: DrawElement,
              public SVGStockage: SVGStockageService) {
    this.SVGStockage.addSVG(this.element);
    this.SVGKey = this.SVGStockage.size;
  }

  undo() {
    const element = this.SVGStockage.removeSVG(this.SVGKey);
    if (element) {
      this.element = element;
    }
  }

  redo() {
    if (this.element) {
      this.SVGStockage.addSVG(this.element, this.SVGKey);
    }
  }
}
