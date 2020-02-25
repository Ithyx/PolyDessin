import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Point } from '../outils/dessin-ligne.service';
import { OUTIL_VIDE, OutilDessin } from '../outils/gestionnaire-outils.service';
import { DrawElement } from './draw-element';

@Injectable({
  providedIn: 'root'
})
export class RectangleService implements DrawElement {
  SVG: string;
  SVGHtml: SafeHtml;

  points: Point[] = [{x: 0, y: 0},    // points[0], coin haut gauche (base)
                     {x: 0, y: 0}];   // points[1], coin bas droite
  isSelected = false;

  primaryColor: string;
  secondaryColor: string;

  thickness: number;
  perimeter: string;
  isDotted: boolean;

  tool: OutilDessin = OUTIL_VIDE;
  width = 0;
  height = 0;

  getWidth(): number {
    return Math.abs(this.points[1].x - this.points[0].x);
  };

  getHeight(): number {
    return Math.abs(this.points[1].y - this.points[0].y);
  };

  draw() {
    if ((this.getWidth() === 0 || this.getHeight() === 0)
      && this.tool.parametres[1].optionChoisie !== 'Plein') {
      this.drawLine();
    } else {
      this.drawRectangle();
    }
    this.drawPerimeter();
  }

  drawLine() {
    if (this.tool.parametres[0].valeur) {
      this.thickness = this.tool.parametres[0].valeur;
    }

    this.SVG = '<line stroke-linecap="square'
      + '" stroke="' + this.secondaryColor
      + '" stroke-width="' + this.tool.parametres[0].valeur
      + (this.isDotted ? '"stroke-dasharray="4, 4"'  : '')
      + '" x1="' + this.points[0].x + '" y1="' + this.points[0].y
      + '" x2="' + (this.points[0].x + this.getWidth())
      + '" y2="' + (this.points[0].y + this.getHeight()) + '"/>';
  }

  drawRectangle() {
    const choosedOption = this.tool.parametres[1].optionChoisie;
    this.SVG = '<rect fill="'
      + ((choosedOption !== 'Contour') ? this.primaryColor : 'none')
      + '" stroke="' + ((choosedOption !== 'Plein') ? this.secondaryColor : 'none')
      + (this.isDotted ? '"stroke-dasharray="4, 4"'  : '')
      + '" stroke-width="' + this.tool.parametres[0].valeur
      + '" x="' + this.points[0].x + '" y="' + this.points[0].y
      + '" width="' + this.getWidth() + '" height="' + this.getHeight() + '"/>';
  }

  drawPerimeter() {
    if (this.tool.parametres[1].optionChoisie === 'Plein') {
      this.thickness = 0;
    } else if (this.tool.parametres[0].valeur) {
      this.thickness = this.tool.parametres[0].valeur;
    }
    const thickness = (this.tool.parametres[0].valeur) ? this.tool.parametres[0].valeur : 0;
    this.perimeter = '<rect stroke="gray" fill="none" stroke-width="2' + (this.isDotted ? '"stroke-dasharray="4, 4"'  : '');
    if (this.tool.parametres[1].optionChoisie === 'Plein') {
      this.perimeter += '" x="' + this.points[0].x + '" y="' + this.points[0].y
        + '" height="' + this.getHeight() + '" width="' + this.getWidth() + '"/>';
    } else {
      this.perimeter += '" x="' + (this.points[0].x - thickness / 2)
        + '" y="' + (this.points[0].y - thickness / 2);
      this.perimeter += '" height="' + ((this.getHeight() === 0) ? thickness : (this.getHeight() + thickness))
        + '" width="' + ((this.getWidth() === 0) ? thickness : (this.getWidth() + thickness)) + '"/>';
    }
  }
}
