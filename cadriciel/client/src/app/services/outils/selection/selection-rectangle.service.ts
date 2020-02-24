import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RectangleService } from '../../stockage-svg/rectangle.service';
import { Point } from '../dessin-ligne.service';
import { OutilDessin } from '../gestionnaire-outils.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionRectangleService {
  selectionEnCours = false;
  rectangle = new RectangleService();
  // Coordonnées du clic initial de souris
  initial: Point = {x: 0, y: 0};
  // Coordonnées du point inférieur gauche
  baseCalculee: Point = {x: 0, y: 0};
  // Dimensions du rectangle
  largeurCalculee = 0;
  hauteurCalculee = 0;

  rectangleSelectionTool: OutilDessin = {nom: '',
                                         estActif: true,
                                         ID: -1,
                                         parametres: [
                                          {type: 'invisible', nom: 'Épaisseur du contour', valeur: 5},
                                          {type: 'invisible', nom: 'Type de tracé', optionChoisie: 'Plein'}
                                         ],
                                         nomIcone: ''};

  constructor(private sanitizer: DomSanitizer) { }

  actualiserSVG() {
    this.rectangle.outil = this.rectangleSelectionTool;
    this.rectangle.couleurPrincipale = 'rgba(0, 80, 130, 0.5)';
    this.rectangle.dessiner();
    this.rectangle.SVGHtml = this.sanitizer.bypassSecurityTrustHtml(this.rectangle.SVG);
  }

  sourisDeplacee(souris: MouseEvent) {
    if (this.selectionEnCours) {
      // Calcule des valeurs pour former un rectangle
      this.largeurCalculee = Math.abs(this.initial.x - souris.offsetX);
      this.hauteurCalculee = Math.abs(this.initial.y - souris.offsetY);
      this.baseCalculee.x = Math.min(this.initial.x, souris.offsetX);
      this.baseCalculee.y = Math.min(this.initial.y, souris.offsetY);
      // Si shift est enfoncé, les valeurs calculées sont ajustées pour former un carré
      if (souris.shiftKey) {
        this.shiftEnfonce();
      } else {
        this.shiftRelache();
      }
    }
  }

  sourisEnfoncee(souris: MouseEvent) {
    this.initial = {x: souris.offsetX, y: souris.offsetY};
    this.selectionEnCours = true;
  }

  sourisRelachee() {
    this.baseCalculee = {x: 0, y: 0};
    this.hauteurCalculee = 0;
    this.largeurCalculee = 0;
    this.rectangle = new RectangleService();
    this.selectionEnCours = false;
  }

  shiftEnfonce() {
    // Lorsque la touche 'shift' est enfoncée, la forme à dessiner est un carré
    if (this.largeurCalculee < this.hauteurCalculee) {
      this.rectangle.points[0].y = (this.baseCalculee.y === this.initial.y) ?
        this.baseCalculee.y : (this.baseCalculee.y + (this.hauteurCalculee - this.largeurCalculee));
      this.rectangle.points[0].x = this.baseCalculee.x;
      this.rectangle.points[1] = {x: this.baseCalculee.x + this.largeurCalculee, y: this.baseCalculee.y + this.largeurCalculee};

    } else {
      this.rectangle.points[0].x = (this.baseCalculee.x === this.initial.x) ?
        this.baseCalculee.x : (this.baseCalculee.x + (this.largeurCalculee - this.hauteurCalculee));
      this.rectangle.points[0].y = this.baseCalculee.y;
      this.rectangle.points[1] = {x: this.baseCalculee.x + this.hauteurCalculee, y: this.baseCalculee.y + this.hauteurCalculee};
    }
    this.actualiserSVG();
  }

  shiftRelache() {
    // Lorsque la touche 'shift' est relâchée, la forme à dessiner est un rectangle
    this.rectangle.points[0] = this.baseCalculee;
    this.rectangle.points[1] = {x: this.baseCalculee.x + this.largeurCalculee, y: this.baseCalculee.y + this.hauteurCalculee};
    this.actualiserSVG();
  }

}
