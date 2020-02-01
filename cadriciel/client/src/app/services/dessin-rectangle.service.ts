import { Injectable } from '@angular/core';
import { GestionnaireOutilsService } from './outils/gestionnaire-outils.service'
import { StockageSvgService } from './stockage-svg.service';

@Injectable({
  providedIn: 'root'
})
export class DessinRectangleService {
  rectangleEnCours = false;
  xInitial: number;
  yInitial: number;
  largeur = 0;
  hauteur = 0;
  // Valeurs par défaut pour tests
  couleurPrimaire = 'red';
  couleurSecondaire = 'black';

  constructor(public stockageSVG: StockageSvgService, public outils: GestionnaireOutilsService) { }

  onMouseMoveRectangle(mouse: MouseEvent) {
    if (this.rectangleEnCours) {
      this.largeur = Math.abs(this.xInitial - mouse.offsetX);
      this.hauteur = Math.abs(this.yInitial - mouse.offsetY);
      const baseX = Math.min(this.xInitial, mouse.offsetX);
      const baseY = Math.min(this.yInitial, mouse.offsetY);
      const optionChoisie = this.outils.outilActif.parametres[1].optionChoisie;

      this.stockageSVG.setSVGEnCours(
        '<rect fill="' + ((optionChoisie !== 'Contour') ? this.couleurPrimaire : 'transparent')
        + '" stroke="' + ((optionChoisie !== 'Plein') ? this.couleurSecondaire : 'transparent')
        + '" stroke-width="' + this.outils.outilActif.parametres[0].valeur
        + '" x="' + baseX + '" y="' + baseY
        + '" width="' + this.largeur + '" height="' + this.hauteur + '"/>'
      );
    }
  }

  onMousePressRectangle(mouse: MouseEvent) {
    this.rectangleEnCours = true;
    this.xInitial = mouse.offsetX;
    this.yInitial = mouse.offsetY;
    this.largeur = 0;
    this.hauteur = 0;
  }

  onMouseReleaseRectangle(mouse: MouseEvent) {
    this.rectangleEnCours = false;
    this.stockageSVG.ajouterSVG(this.stockageSVG.getSVGEnCours() + '"/>');
    this.stockageSVG.setSVGEnCours('');
  }
}
