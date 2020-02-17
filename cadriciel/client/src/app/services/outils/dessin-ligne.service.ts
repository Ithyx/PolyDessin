import { Injectable } from '@angular/core';
import { StockageSvgService } from '../stockage-svg/stockage-svg.service';
import { GestionnaireOutilsService } from './gestionnaire-outils.service';
import { InterfaceOutils } from './interface-outils';

export interface Point {
  x: number;
  y: number;
}

@Injectable({
  providedIn: 'root'
})
export class DessinLigneService implements InterfaceOutils {
  points: Point[] = [];
  private estClicSimple = true;
  positionShiftEnfoncee: Point;

  curseur: Point = {x: 0, y: 0};
  position: Point = {x: 0, y: 0};

  constructor(public stockageSVG: StockageSvgService, public outils: GestionnaireOutilsService) { }

  sourisDeplacee(souris: MouseEvent) {
    this.curseur.x = souris.offsetX;
    this.curseur.y = souris.offsetY;
    if (souris.shiftKey) {
      this.shiftEnfonce();
    } else {
      this.shiftRelache();
    }
  }

  sourisCliquee() {
    this.estClicSimple = true;
    this.points.push({x: this.position.x, y: this.position.y});
    window.setTimeout(() => {
      if (this.estClicSimple) {this.actualiserSVG()}
    }, 250);
  }

  sourisDoubleClic(souris: MouseEvent) {
    this.estClicSimple = false;
    if (this.points.length !== 0) {
      let SVG: string;
      if (Math.abs(souris.offsetX - this.points[0].x) <= 3
          && Math.abs(souris.offsetY - this.points[0].y) <= 3) {
        // On retire le dernier point pour fermer le polygone
        // (Un double clic ajoute 2 points au conteneur qu'il faut retirer)
        this.points.pop();
        this.points.pop();
        SVG = '<polygon fill="none" stroke="black" stroke-width="'
            + this.outils.outilActif.parametres[0].valeur + '" points="';
        for (const point of this.points) {
          SVG += point.x + ' ' + point.y + ' ';
        }
        SVG += '" />';
        if (this.outils.outilActif.parametres[1].optionChoisie === 'Avec points' ) {
          SVG += this.avecPoints(SVG);
        }
      } else {
        SVG = this.stockageSVG.getSVGEnCours() + '" />';
        if (this.outils.outilActif.parametres[1].optionChoisie === 'Avec points') {
          SVG += ' <circle cx="' + this.position.x + '" cy="' + this.position.y + '" r="'
              + this.outils.outilActif.parametres[2].valeur  + '" fill="black"/>';
        }
      }
      this.stockageSVG.ajouterSVG(SVG);
      this.stockageSVG.setSVGEnCours('');
      this.points = [];
    }
  }

  avecPoints(SVG: string): string {
    for (const point of this.points) {
      SVG += ' <circle cx="' + point.x + '" cy="' + point.y + '" r="'
      + this.outils.outilActif.parametres[2].valeur  + '" fill="black"/>';
    }

    return SVG;
  }

  retirerPoint() {
    if (this.points.length > 1) {
      this.points.pop();
      this.actualiserSVG();
    }
  }

  annulerLigne() {
    this.stockageSVG.setSVGEnCours('');
    this.points = [];
  }

  stockerCurseur() {
    this.positionShiftEnfoncee = {x: this.curseur.x, y: this.curseur.y};
  }

  shiftEnfonce() {
    const dernierPoint = this.points[this.points.length - 1];
    const angle = Math.atan((this.curseur.y - dernierPoint.y) / (this.curseur.x - dernierPoint.x));
    const alignement = Math.abs(Math.round(angle / (Math.PI / 4)));

    // alignement = 0 lorsque angle = 0,180­°
    // alignement = 1 lorsque angle = 45,135,225,315°
    // alignement = 2 lorsque angle = 90,270°
    if (alignement === 0) {
      this.position.x = this.curseur.x;
      this.position.y = dernierPoint.y;
    } else if (alignement === 1) {
      if (Math.sign(this.curseur.x - dernierPoint.x) === Math.sign(this.curseur.y - dernierPoint.y)) {
        this.position.y = this.curseur.x - dernierPoint.x + dernierPoint.y;
      } else {
        this.position.y = dernierPoint.x - this.curseur.x + dernierPoint.y;
      }
      this.position.x = this.curseur.x;
    } else {
      this.position.x = dernierPoint.x;
      this.position.y = this.curseur.y;
    }

    this.actualiserSVG();
  }

  shiftRelache() {
    this.position.x = this.curseur.x;
    this.position.y = this.curseur.y;
    this.actualiserSVG();
  }

  actualiserSVG() {
    let SVG = '<polyline fill="none" stroke="black" stroke-width="'
      + this.outils.outilActif.parametres[0].valeur + '" points="';

    for (const point of this.points) {
      SVG += point.x + ' ' + point.y + ' ';
    }

    SVG += this.position.x + ' ' + this.position.y + '"/>';

    if (this.outils.outilActif.parametres[1].optionChoisie === 'Avec points' ) {
      SVG += this.avecPoints(SVG);
    }

    this.stockageSVG.setSVGEnCours(SVG);
  }

  vider() {
    this.points = [];
    this.positionShiftEnfoncee = {x: 0, y: 0};
    this.curseur.x = 0;
    this.curseur.y = 0;
    this.position.x = 0;
    this.position.y = 0;
    this.stockageSVG.setSVGEnCours('');
  }
}
