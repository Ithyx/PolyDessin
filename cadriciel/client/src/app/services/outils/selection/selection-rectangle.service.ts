import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RectangleService } from '../../stockage-svg/rectangle.service';
import { Point } from '../dessin-ligne.service';
import { OutilDessin } from '../gestionnaire-outils.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionRectangleService {
  onoingSelection = false;
  rectangle: RectangleService;
  // Coordonnées du clic initial de souris
  initialPoint: Point = {x: 0, y: 0};
  // Coordonnées du point inférieur gauche
  basisPoint: Point = {x: 0, y: 0};
  // Dimensions du rectangle
  weightCalculated = 0;
  heightCalculated = 0;

  rectangleSelectionTool: OutilDessin = {nom: '',
                                         estActif: true,
                                         ID: -1,
                                         parametres: [
                                          {type: 'invisible', nom: 'Épaisseur du contour', valeur: 5},
                                          {type: 'invisible', nom: 'Type de tracé', optionChoisie: 'Plein avec contour'}
                                         ],
                                         nomIcone: ''};

  constructor(private sanitizer: DomSanitizer) { }

  refreshSVG() {
    this.rectangle.tool = this.rectangleSelectionTool;
    this.rectangle.primaryColor = 'rgba(0, 80, 130, 0.35)';
    this.rectangle.secondaryColor = 'rgba(80, 80, 80, 0.45)';
    this.rectangle.draw();
    this.rectangle.SVGHtml = this.sanitizer.bypassSecurityTrustHtml(this.rectangle.SVG);
  }

  mouseMouve(mouse: MouseEvent) {
    if (this.onoingSelection) {
      // Calcule des valeurs pour former un rectangle
      this.weightCalculated = Math.abs(this.initialPoint.x - mouse.offsetX);
      this.heightCalculated = Math.abs(this.initialPoint.y - mouse.offsetY);

      this.basisPoint = {x: Math.min(this.initialPoint.x, mouse.offsetX), y: Math.min(this.initialPoint.y, mouse.offsetY)};

      this.rectangle.points[0] = this.basisPoint;
      this.rectangle.points[1] = {x: this.basisPoint.x + this.weightCalculated, y: this.basisPoint.y + this.heightCalculated};

      this.refreshSVG();
    }
  }

  mouseDown(souris: MouseEvent) {
    this.rectangle = new RectangleService();
    this.rectangle.isDotted = true;
    this.initialPoint = {x: souris.offsetX, y: souris.offsetY};
    this.onoingSelection = true;
  }

  mouseUp() {
    this.basisPoint = {x: 0, y: 0};
    this.heightCalculated = 0;
    this.weightCalculated = 0;
    this.onoingSelection = false;
  }

}
