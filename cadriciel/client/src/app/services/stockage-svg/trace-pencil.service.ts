import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Point } from '../outils/dessin-ligne.service';
import { OUTIL_VIDE, OutilDessin } from '../outils/gestionnaire-outils.service';
import { DrawElement } from './draw-element';

@Injectable({
  providedIn: 'root'
})
export class TracePencilService implements DrawElement {
  SVG: string;
  SVGHtml: SafeHtml;

  points: Point[] = [];
  isSelected = false;

  tool: OutilDessin = OUTIL_VIDE;
  thickness: number;

  isAPoint = false;
  primaryColor: string;

  draw() {
    if (this.isAPoint) {
      this.drawPoint();
    } else {
      this.drawPath();
    }
  }

  drawPath() {
    if (this.tool.parametres[0].valeur) {
      this.thickness = this.tool.parametres[0].valeur;
    }
    this.SVG = `<path fill="none" stroke="${this.primaryColor}"`
      + 'stroke-linecap="round" stroke-width="' + this.tool.parametres[0].valeur + '" d="';
    for (let i = 0; i < this.points.length; ++i) {
      this.SVG += (i === 0) ? 'M ' : 'L ';
      this.SVG += this.points[i].x + ' ' + this.points[i].y + ' ';
    }
    this.SVG += '" />';
  }

  drawPoint() {
    if (this.tool.parametres[0].valeur) {
      this.thickness = this.tool.parametres[0].valeur;
      this.SVG = '<circle cx="' + this.points[0].x + '" cy="' + this.points[0].y
        + '" r="' + this.tool.parametres[0].valeur / 2
        + '" fill="' + this.primaryColor + '"/>';
    }
  }
}
