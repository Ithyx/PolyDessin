import { Injectable } from '@angular/core';
import { GestionnaireOutilsService } from './outils/gestionnaire-outils.service'
import { StockageSvgService } from './stockage-svg.service';

@Injectable({
  providedIn: 'root'
})
export class DessinRectangleService {
  epaisseur: number;
  couleur: string;
  typeTrace: string;
  rectangleEnCours = false;
  xInitial: number;
  yInitial: number;

  constructor(public stockageSVG: StockageSvgService, public outils: GestionnaireOutilsService) { }

  onMouseMoveRectangle(mouse: MouseEvent) {
    if (this.rectangleEnCours) {
      const largeur = Math.abs(this.xInitial - mouse.offsetX);
      const hauteur = Math.abs(this.yInitial - mouse.offsetY);
      const baseX = Math.min(this.xInitial, mouse.offsetX);
      const baseY = Math.min(this.yInitial, mouse.offsetY);

      this.stockageSVG.setSVGEnCours(
        '<rect fill="transparent" stroke="black" stroke-width="'
        + this.outils.outilActif.parametres[0].valeur + '" x="'
        + baseX + '" y="' + baseY + '" width="'
        + largeur + '" height="' + hauteur + '"/>'
      );
    }
  }

  onMousePressRectangle(mouse: MouseEvent) {
    this.rectangleEnCours = true;
    this.xInitial = mouse.offsetX;
    this.yInitial = mouse.offsetY;
  }

  onMouseReleaseRectangle(mouse: MouseEvent) {
    this.rectangleEnCours = false;
    this.stockageSVG.ajouterSVG(this.stockageSVG.getSVGEnCours() + '"/>');
    this.stockageSVG.setSVGEnCours('');
  }
}
