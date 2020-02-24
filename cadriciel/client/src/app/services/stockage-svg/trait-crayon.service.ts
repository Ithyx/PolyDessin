import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Point } from '../outils/dessin-ligne.service';
import { OUTIL_VIDE, OutilDessin } from '../outils/gestionnaire-outils.service';
import { ElementDessin } from './element-dessin';

@Injectable({
  providedIn: 'root'
})
export class TraitCrayonService implements ElementDessin {
  SVG: string;
  SVGHtml: SafeHtml;
  estSelectionne = false;

  outil: OutilDessin = OUTIL_VIDE;
  points: Point[] = [];
  estPoint = false;
  couleurPrincipale: string;

  dessiner() {
    if (this.estPoint) {
      this.dessinerPoint();
    } else {
      this.dessinerChemin();
    }
  }

  dessinerChemin() {
    this.SVG = `<path fill="transparent" stroke="${this.couleurPrincipale}"`
      + 'stroke-linecap="round" stroke-width="' + this.outil.parametres[0].valeur + '" d="';
    for (let i = 0; i < this.points.length; ++i) {
      this.SVG += (i === 0) ? 'M ' : 'L ';
      this.SVG += this.points[i].x + ' ' + this.points[i].y + ' ';
    }
    this.SVG += '" />';
  }

  dessinerPoint() {
    if (this.outil.parametres[0].valeur) {
      this.SVG = '<circle cx="' + this.points[0].x + '" cy="' + this.points[0].y
        + '" r="' + this.outil.parametres[0].valeur / 2
        + '" fill="' + this.couleurPrincipale + '"/>';
    }
  }
}
