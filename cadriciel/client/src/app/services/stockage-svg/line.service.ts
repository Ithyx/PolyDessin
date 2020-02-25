import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Point } from '../outils/dessin-ligne.service';
import { OUTIL_VIDE, OutilDessin } from '../outils/gestionnaire-outils.service';
import { DrawElement } from './draw-element';

@Injectable({
  providedIn: 'root'
})
export class LineService implements DrawElement {
  SVG: string;
  SVGHtml: SafeHtml;

  points: Point[] = [];
  isSelected = false;

  primaryColor = 'rgba(0,0,0,1)';

  tool: OutilDessin = OUTIL_VIDE;
  thickness: number;
  isAPolygon = false;
  mousePosition = {x: 0, y: 0};

  draw() {
    if (this.tool.parametres[0].valeur) {
      this.thickness = this.tool.parametres[0].valeur;
    }
    this.SVG = (this.isAPolygon) ? '<polygon ' : '<polyline ';
    this.SVG += 'fill="none" stroke="' + this.primaryColor + '" stroke-width="' + this.tool.parametres[0].valeur
    this.SVG += '" points="';
    for (const point of this.points) {
      this.SVG += point.x + ' ' + point.y + ' ';
    }
    if (!this.isAPolygon) {
      this.SVG += this.mousePosition.x + ' ' + this.mousePosition.y;
    }
    this.SVG += '" />';
    if (this.tool.parametres[1].optionChoisie === 'Avec points') {
      this.drawPoints();
    }
  }

  drawPoints() {
    if (this.tool.parametres[2].valeur) {
      if(2 * this.tool.parametres[2].valeur > this.thickness) {
        this.thickness = 2 * this.tool.parametres[2].valeur;
    }
  }
    for (const point of this.points) {
      this.SVG += ' <circle cx="' + point.x + '" cy="' + point.y + '" r="'
      + this.tool.parametres[2].valeur  + '" fill="' + this.primaryColor + '"/>';
    }
  }

  isEmpty() {
    return this.points.length === 0 ||
      (this.points.length === 1 && this.tool.parametres[1].optionChoisie === 'Sans points');
  }
}
