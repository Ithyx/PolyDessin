import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { ElementDessin } from '../../../../../common/communication/element-dessin';
import { Point } from '../outils/dessin-ligne.service';
import { OUTIL_VIDE, OutilDessin } from '../outils/gestionnaire-outils.service';

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
