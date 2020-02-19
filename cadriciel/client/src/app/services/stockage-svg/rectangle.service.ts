import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Point } from '../outils/dessin-ligne.service';
import { OUTIL_VIDE, OutilDessin } from '../outils/gestionnaire-outils.service';
import { ElementDessin } from './element-dessin';

@Injectable({
  providedIn: 'root'
})
export class RectangleService implements ElementDessin {
  SVG: string;
  SVGHtml: SafeHtml;
  perimetre: string;
  estSelectionne = false;

  points: Point[] = [{x: 0, y: 0},    // points[0], coin haut gauche (base)
                     {x: 0, y: 0}];   // points[1], coin bas droite

  couleurPrincipale: string;
  couleurSecondaire: string;

  outil: OutilDessin = OUTIL_VIDE;
  largeur = 0;
  hauteur = 0;

  getLargeur(): number {
    return Math.abs(this.points[1].x - this.points[0].x);
  };

  getHauteur(): number {
    return Math.abs(this.points[1].y - this.points[0].y);
  };

  dessiner() {
    if ((this.getLargeur() === 0 || this.getHauteur() === 0)
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
      + '" x1="' + this.points[0].x + '" y1="' + this.points[0].y
      + '" x2="' + (this.points[0].x + this.getLargeur())
      + '" y2="' + (this.points[0].y + this.getHauteur()) + '"/>';
  }

  dessinerRectangle() {
    const optionChoisie = this.outil.parametres[1].optionChoisie;
    this.SVG = '<rect fill="'
      + ((optionChoisie !== 'Contour') ? this.couleurPrincipale : 'transparent')
      + '" stroke="' + ((optionChoisie !== 'Plein') ? this.couleurSecondaire : 'transparent')
      + '" stroke-width="' + this.outil.parametres[0].valeur
      + '" x="' + this.points[0].x + '" y="' + this.points[0].y
      + '" width="' + this.getLargeur() + '" height="' + this.getHauteur() + '"/>';
  }

  dessinerPerimetre() {
    const epaisseur = (this.outil.parametres[0].valeur) ? this.outil.parametres[0].valeur : 0;
    this.perimetre = '<rect stroke="gray" fill="transparent" stroke-width="2';
    if (this.outil.parametres[1].optionChoisie === 'Plein') {
      this.perimetre += '" x="' + this.points[0].x + '" y="' + this.points[0].y
        + '" height="' + this.getHauteur + '" width="' + this.getLargeur + '"/>';
    } else {
      this.perimetre += '" x="' + (this.points[0].x - epaisseur / 2)
        + '" y="' + (this.points[0].y - epaisseur / 2);
      this.perimetre += '" height="' + ((this.getHauteur() === 0) ? epaisseur : (this.getHauteur() + epaisseur))
        + '" width="' + ((this.getLargeur() === 0) ? epaisseur : (this.getLargeur() + epaisseur)) + '"/>';
    }
  }
}
