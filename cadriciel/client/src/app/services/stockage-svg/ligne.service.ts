import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { ElementDessin } from '../../../../../common/communication/element-dessin';
import { Point } from '../outils/dessin-ligne.service';
import { OUTIL_VIDE, OutilDessin } from '../outils/gestionnaire-outils.service';

@Injectable({
  providedIn: 'root'
})
export class LigneService implements ElementDessin {
  SVG: string;
  SVGHtml: SafeHtml;
  estSelectionne = false;

  couleurPrincipale = 'rgba(0,0,0,1)';

  outil: OutilDessin = OUTIL_VIDE;
  points: Point[] = [];
  estPolygone = false;
  positionSouris = {x: 0, y: 0};

  dessiner() {
    this.SVG = (this.estPolygone) ? '<polygon ' : '<polyline ';
    this.SVG += 'fill="none" stroke="' + this.couleurPrincipale + '" stroke-width="' + this.outil.parametres[0].valeur
    this.SVG += '" points="';
    for (const point of this.points) {
      this.SVG += point.x + ' ' + point.y + ' ';
    }
    if (!this.estPolygone) {
      this.SVG += this.positionSouris.x + ' ' + this.positionSouris.y;
    }
    this.SVG += '" />';
    if (this.outil.parametres[1].optionChoisie === 'Avec points') {
      this.dessinerPoints();
    }
  }

  dessinerPoints() {
    for (const point of this.points) {
      this.SVG += ' <circle cx="' + point.x + '" cy="' + point.y + '" r="'
      + this.outil.parametres[2].valeur  + '" fill="' + this.couleurPrincipale + '"/>';
    }
  }

  estVide() {
    return this.points.length === 0 ||
      (this.points.length === 1 && this.outil.parametres[1].optionChoisie === 'Sans points');
  }
}
