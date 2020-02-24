import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Point } from '../outils/dessin-ligne.service';
import { OUTIL_VIDE, OutilDessin } from '../outils/gestionnaire-outils.service';
import { ElementDessin } from './element-dessin';

@Injectable({
  providedIn: 'root'
})
export class TraceSprayService implements ElementDessin {

  SVG: string;
  SVGHtml: SafeHtml;
  estSelectionne = false;

  outil: OutilDessin = OUTIL_VIDE;
  points: Point[] = [];
  couleur: string;

  dessiner() {
    this.SVG = '';
    for (const point of this.points) {
      this.SVG += `<circle cx="${point.x}" cy="${point.y}" r="2" fill="black" />`;
    }
  }
}
