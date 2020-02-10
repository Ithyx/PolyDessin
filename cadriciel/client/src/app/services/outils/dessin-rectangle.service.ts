import { Injectable } from '@angular/core';
import { ParametresCouleurService } from '../couleur/parametres-couleur.service';
import { StockageSvgService } from '../stockage-svg.service';
import { GestionnaireOutilsService } from './gestionnaire-outils.service'
import { InterfaceOutils } from './interface-outils'

@Injectable({
  providedIn: 'root'
})
export class DessinRectangleService implements InterfaceOutils {
  rectangleEnCours = false;
  // Coordonnées du clic initial de souris
  xInitial: number;
  yInitial: number;
  // Coordonnées du point inférieur gauche
  baseX: number;
  baseY: number;
  baseXCalculee: number;
  baseYCalculee: number;
  // Dimensions du rectangle
  largeur = 0;
  hauteur = 0;
  largeurCalculee = 0;
  hauteurCalculee = 0;
  // Valeurs par défaut pour tests

  constructor(public stockageSVG: StockageSvgService,
              public outils: GestionnaireOutilsService,
              public couleur: ParametresCouleurService) { }

  actualiserSVG() {
    const optionChoisie = this.outils.outilActif.parametres[1].optionChoisie;
    const epaisseur = (this.outils.outilActif.parametres[0].valeur) ? this.outils.outilActif.parametres[0].valeur : 0;
    // La forme est une ligne (seulement dans le cas où le rectangle a un contour)
    if ((this.largeur === 0 || this.hauteur === 0) && optionChoisie !== 'Plein') {
      // La ligne à tracer
      this.stockageSVG.setSVGEnCours(
        '<line stroke-linecap="square'
        + '" stroke="' + this.couleur.couleurSecondaire
        + '" stroke-width="' + epaisseur
        + '" x1="' + this.baseX + '" y1="' + this.baseY
        + '" x2="' + (this.baseX + this.largeur) + '" y2="' + (this.baseY + this.hauteur) + '"/>'
      );
      // Le périmètre autour de la ligne
      this.stockageSVG.setPerimetreEnCours(
        '<rect stroke="gray" fill="transparent" stroke-width="2'
        + '" x="' + (this.baseX - epaisseur / 2) + '" y="' + (this.baseY - epaisseur / 2)
        + '" height="' + ((this.hauteur === 0) ? epaisseur : (this.hauteur + epaisseur))
        + '" width="' + ((this.largeur === 0) ? epaisseur : (this.largeur + epaisseur)) + '"/>'
      );
    // La forme est un rectangle
    } else {
      // Le rectangle à tracer
      this.stockageSVG.setSVGEnCours(
        '<rect fill="' + ((optionChoisie !== 'Contour') ? this.couleur.couleurPrincipale : 'transparent')
        + '" stroke="' + ((optionChoisie !== 'Plein') ? this.couleur.couleurSecondaire : 'transparent')
        + '" stroke-width="' + epaisseur
        + '" x="' + this.baseX + '" y="' + this.baseY
        + '" width="' + this.largeur + '" height="' + this.hauteur + '"/>'
      );
      // Le périmètre autour du rectangle (prend en compte l'épaisseur si le rectangle a un contour)
      if (optionChoisie === 'Plein') {
        this.stockageSVG.setPerimetreEnCours(
          '<rect stroke="gray" fill="transparent" stroke-width="2'
          + '" x="' + this.baseX + '" y="' + this.baseY
          + '" height="' + this.hauteur + '" width="' + this.largeur + '"/>'
        );
      } else {
        this.stockageSVG.setPerimetreEnCours(
          '<rect stroke="gray" fill="transparent" stroke-width="2'
          + '" x="' + (this.baseX - epaisseur / 2) + '" y="' + (this.baseY - epaisseur / 2)
          + '" height="' + (this.hauteur + epaisseur)
          + '" width="' + (this.largeur + epaisseur) + '"/>'
        );
      }
    }
  }

  sourisDeplacee(souris: MouseEvent) {
    if (this.rectangleEnCours) {
      // Calcule des valeurs pour former un rectangle
      this.largeurCalculee = Math.abs(this.xInitial - souris.offsetX);
      this.hauteurCalculee = Math.abs(this.yInitial - souris.offsetY);
      this.baseXCalculee = Math.min(this.xInitial, souris.offsetX);
      this.baseYCalculee = Math.min(this.yInitial, souris.offsetY);
      // Si shift est enfoncé, les valeurs calculées sont ajustées pour former un carré
      if (souris.shiftKey) {
        this.shiftEnfonce();
      } else {
        this.shiftRelache();
      }
    }
  }

  sourisEnfoncee(souris: MouseEvent) {
    if (!this.rectangleEnCours) {
      this.rectangleEnCours = true;
      this.xInitial = souris.offsetX;
      this.yInitial = souris.offsetY;
      this.largeur = 0;
      this.hauteur = 0;
    }
  }

  sourisRelachee(souris: MouseEvent) {
    this.rectangleEnCours = false;
    // On évite de créer des formes vides
    if (this.largeur !== 0 || this.hauteur !== 0) {
      this.stockageSVG.ajouterSVG(this.stockageSVG.getSVGEnCours() + '"/>');
    }
    this.stockageSVG.setSVGEnCours('');
    this.stockageSVG.setPerimetreEnCours('');
  }

  shiftEnfonce() {
    if (this.rectangleEnCours) {
      // Lorsque la touche 'shift' est enfoncée, la forme à dessiner est un carré
      if (this.largeurCalculee < this.hauteurCalculee) {
        this.baseY = (this.baseYCalculee === this.yInitial) ?
          this.baseYCalculee : (this.baseYCalculee + (this.hauteurCalculee - this.largeurCalculee));
        this.baseX = this.baseXCalculee;
        this.hauteur = this.largeurCalculee;
        this.largeur = this.largeurCalculee;
      } else {
        this.baseX = (this.baseXCalculee === this.xInitial) ?
          this.baseXCalculee : (this.baseXCalculee + (this.largeurCalculee - this.hauteurCalculee));
        this.baseY = this.baseYCalculee;
        this.largeur = this.hauteurCalculee;
        this.hauteur = this.hauteurCalculee;
      }
      this.actualiserSVG();
    }
  }

  shiftRelache() {
    if (this.rectangleEnCours) {
      // Lorsque la touche 'shift' est relâchée, la forme à dessiner est un rectangle
      this.baseX = this.baseXCalculee;
      this.baseY = this.baseYCalculee;
      this.hauteur = this.hauteurCalculee;
      this.largeur = this.largeurCalculee;
      this.actualiserSVG();
    }
  }

  vider() {
    this.rectangleEnCours = false;
    this.stockageSVG.setPerimetreEnCours('');
    this.stockageSVG.setSVGEnCours('');
  }
}
