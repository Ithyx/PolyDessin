import { Injectable } from '@angular/core';
import { StockageSvgService } from './stockage-svg.service';

@Injectable({
  providedIn: 'root'
})
export class DessinRectangleService {
  epaisseur: number;
  couleur: string;
  typeTrace: string;
  clicRectangle = false;
  xInitial: number;
  yInitial: number;

  constructor(public stockageSVG: StockageSvgService) { }

  onMouseMoveRectangle(mouse: MouseEvent) {
    if (this.clicRectangle) {
      const largeur = Math.abs(this.xInitial - mouse.offsetX);
      const hauteur = Math.abs(this.yInitial - mouse.offsetY);
      this.stockageSVG.setSVGEnCours(
        '<rect fill="transparent" stroke="black" stroke-width="20" x="'
        + mouse.offsetX + '" y="' + mouse.offsetY + '" width="'
        + largeur + '" height="' + hauteur + '"/>'
      );
    }
  }

  onMousePressRectangle(mouse: MouseEvent) {
    this.clicRectangle = true;
    this.xInitial = mouse.offsetX;
    this.yInitial = mouse.offsetY;
    this.stockageSVG.setSVGEnCours(
      '<rect fill="transparent" stroke="black" stroke-width="20" x="'
      + mouse.offsetX + '" y="' + mouse.offsetY + '"/>'
    );
  }

  onMouseReleaseRectangle(mouse: MouseEvent) {
    this.stockageSVG.ajouterSVG(this.stockageSVG.getSVGEnCours());
    this.stockageSVG.setSVGEnCours('');
  }

  onMouseLeaveRectangle(mouse: MouseEvent) {
    this.stockageSVG.ajouterSVG(this.stockageSVG.getSVGEnCours());
    this.stockageSVG.setSVGEnCours('');
  }
}
