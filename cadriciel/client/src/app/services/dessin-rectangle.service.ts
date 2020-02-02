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
      let baseX = Math.min(this.xInitial, mouse.offsetX);
      let baseY = Math.min(this.yInitial, mouse.offsetY);
      const optionChoisie = this.outils.outilActif.parametres[1].optionChoisie;
      const epaisseur = (this.outils.outilActif.parametres[0].valeur) ? this.outils.outilActif.parametres[0].valeur : 0;

      // Lorsque la touche 'shift' est enfoncée, la forme à dessiner est un carré
      if (mouse.shiftKey) {
        if (this.largeur < this.hauteur) {
          baseY = (baseY === this.yInitial) ? baseY : (baseY + (this.hauteur - this.largeur));
          this.hauteur = this.largeur;
        } else {
          baseX = (baseX === this.xInitial) ? baseX : (baseX + (this.largeur - this.hauteur));
          this.largeur = this.hauteur;
        }
      }
      // La forme est une ligne (seulement dans le cas où le rectangle a un contour)
      if ((this.largeur === 0 || this.hauteur === 0) && optionChoisie !== 'Plein') {
        // La ligne à tracer
        this.stockageSVG.setSVGEnCours(
          '<line stroke-linecap="square'
          + '" stroke="' + this.couleurSecondaire
          + '" stroke-width="' + epaisseur
          + '" x1="' + baseX + '" y1="' + baseY
          + '" x2="' + (baseX + this.largeur) + '" y2="' + (baseY + this.hauteur) + '"/>'
        );
        // Le périmètre autour de la ligne
        this.stockageSVG.setPerimetreEnCours(
          '<rect stroke="gray" fill="transparent" stroke-width="2'
          + '" x="' + (baseX - epaisseur / 2) + '" y="' + (baseY - epaisseur / 2)
          + '" height="' + ((this.hauteur === 0) ? epaisseur : (this.hauteur + epaisseur))
          + '" width="' + ((this.largeur === 0) ? epaisseur : (this.largeur + epaisseur)) + '"/>'
        );
      // La forme est un rectangle
      } else {
        // Le rectangle à tracer
        this.stockageSVG.setSVGEnCours(
          '<rect fill="' + ((optionChoisie !== 'Contour') ? this.couleurPrimaire : 'transparent')
          + '" stroke="' + ((optionChoisie !== 'Plein') ? this.couleurSecondaire : 'transparent')
          + '" stroke-width="' + epaisseur
          + '" x="' + baseX + '" y="' + baseY
          + '" width="' + this.largeur + '" height="' + this.hauteur + '"/>'
        );
        // Le périmètre autour du rectangle (prend en compte l'épaisseur si le rectangle a un contour)
        if (optionChoisie === 'Plein') {
          this.stockageSVG.setPerimetreEnCours(
            '<rect stroke="gray" fill="transparent" stroke-width="2'
            + '" x="' + baseX + '" y="' + baseY
            + '" height="' + this.hauteur + '" width="' + this.largeur + '"/>'
          );
        } else {
          this.stockageSVG.setPerimetreEnCours(
            '<rect stroke="gray" fill="transparent" stroke-width="2'
            + '" x="' + (baseX - epaisseur / 2) + '" y="' + (baseY - epaisseur / 2)
            + '" height="' + (this.hauteur + epaisseur)
            + '" width="' + (this.largeur + epaisseur) + '"/>'
          );
        }
      }
    }
  }

  onMousePressRectangle(mouse: MouseEvent) {
    if (!this.rectangleEnCours) {
      this.rectangleEnCours = true;
      this.xInitial = mouse.offsetX;
      this.yInitial = mouse.offsetY;
      this.largeur = 0;
      this.hauteur = 0;
    }
  }

  onMouseReleaseRectangle(mouse: MouseEvent) {
    this.rectangleEnCours = false;
    // On évite de créer des formes vides
    if (this.largeur !== 0 || this.hauteur !== 0) {
      this.stockageSVG.ajouterSVG(this.stockageSVG.getSVGEnCours() + '"/>');
    }
    this.stockageSVG.setSVGEnCours('');
    this.stockageSVG.setPerimetreEnCours('');
  }
}
