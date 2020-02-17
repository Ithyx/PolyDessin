import { Injectable } from '@angular/core';
import { Point } from '../outils/dessin-ligne.service';
import { OutilDessin } from '../outils/gestionnaire-outils.service';
import { ElementDessin } from './element-dessin';

@Injectable({
  providedIn: 'root'
})
export class RectangleService implements ElementDessin {
  SVG: string;
  perimetre: string;
  estSelectionne = false;

  couleurPrincipale: string;
  couleurSecondaire: string;

  outil: OutilDessin;
  base: Point = {x: 0, y: 0};
  largeur = 0;
  hauteur = 0;

  dessiner() {
    if ((this.largeur === 0 || this.hauteur === 0)
      && this.outil.parametres[1].optionChoisie !== 'Plein') {
      this.dessinerLigne();
    } else {
      this.dessinerRectangle();
    }
    this.dessinerPerimetre();
  }

  dessinerLigne() {
    this.SVG = '<line stroke-linecap="square'
      + '" stroke="' + this.couleurSecondaire
      + '" stroke-width="' + this.outil.parametres[0].valeur
      + '" x1="' + this.base.x + '" y1="' + this.base.y
      + '" x2="' + (this.base.x + this.largeur)
      + '" y2="' + (this.base.y + this.hauteur) + '"/>';
  }

  dessinerRectangle() {
    const optionChoisie = this.outil.parametres[1].optionChoisie;
    this.SVG = '<rect fill="'
      + ((optionChoisie !== 'Contour') ? this.couleurPrincipale : 'transparent')
      + '" stroke="' + ((optionChoisie !== 'Plein') ? this.couleurSecondaire : 'transparent')
      + '" stroke-width="' + this.outil.parametres[0].valeur
      + '" x="' + this.base.x + '" y="' + this.base.y
      + '" width="' + this.largeur + '" height="' + this.hauteur + '"/>'
  }

  dessinerPerimetre() {
    const epaisseur = (this.outil.parametres[0].valeur) ? this.outil.parametres[0].valeur : 0;
    this.perimetre = '<rect stroke="gray" fill="transparent" stroke-width="2';
    if (this.outil.parametres[1].optionChoisie === 'Plein') {
      this.perimetre += '" x="' + this.base.x + '" y="' + this.base.y
        + '" height="' + this.hauteur + '" width="' + this.largeur + '"/>'
    } else {
      this.perimetre += '" height="' + ((this.hauteur === 0) ? epaisseur : (this.hauteur + epaisseur))
        + '" width="' + ((this.largeur === 0) ? epaisseur : (this.largeur + epaisseur)) + '"/>'
    }
  }
}
