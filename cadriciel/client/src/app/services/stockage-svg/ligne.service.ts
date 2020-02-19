import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Point } from '../outils/dessin-ligne.service';
import { OutilDessin } from '../outils/gestionnaire-outils.service';
import { ElementDessin } from './element-dessin';

@Injectable({
  providedIn: 'root'
})
export class LigneService implements ElementDessin {
  SVG: string;
  SVGHtml: SafeHtml;
  estSelectionne = false;

  points: Point[] = [];
  estPolygone = false;
  positionSouris = {x: 0, y: 0};
  outil: OutilDessin;

  dessiner() {
    this.SVG = (this.estPolygone) ? '<polygon ' : '<polyline ';
    this.SVG += 'fill="none" stroke="black" stroke-width="' + this.outil.parametres[0].valeur
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
      + this.outil.parametres[2].valeur  + '" fill="black"/>';
    }
  }

  estVide() {
    return this.points.length === 0 ||
      (this.points.length === 1 && this.outil.parametres[1].optionChoisie === 'Sans points');
  }
}
