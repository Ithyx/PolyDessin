import { Injectable } from '@angular/core';
import { StockageSvgService } from '../stockage-svg.service';
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
  curseurX: number;
  curseurY: number;
  positionX: number;
  positionY: number;

  constructor(public stockageSVG: StockageSvgService, public outils: GestionnaireOutilsService) { }
  sourisDeplacee(souris: MouseEvent) {
    this.curseurX = souris.offsetX;
    this.curseurY = souris.offsetY;
    if (souris.shiftKey) {
      this.shiftEnfonce();
    } else {
      this.shiftRelache();
    }
  }
  sourisEnfoncee(souris: MouseEvent) {
    /**/
  }
  sourisRelachee(souris: MouseEvent) {
    /**/
  }
  sourisCliquee(souris: MouseEvent) {
    this.estClicSimple = true;
    const x = this.positionX;
    const y = this.positionY;
    this.points.push({x, y});
    window.setTimeout(() => {
      if (this.estClicSimple) {this.actualiserSVG()}
    }, 250)
  }
  sourisSortie(souris: MouseEvent) {
    /**/
  }
  sourisEntree(souris: MouseEvent) {
    /**/
  }

  sourisDoubleClic(souris: MouseEvent) {
    this.estClicSimple = false;
    if (this.points.length !== 0) {
      let SVG: string;
      if (Math.abs(souris.offsetX - this.points[0].x) <= 3
          && Math.abs(souris.offsetY - this.points[0].y) <= 3) {
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
        this.stockageSVG.setSVGEnCours(SVG);
      } else {
        SVG = this.stockageSVG.getSVGEnCours() + '" />';
        if (this.outils.outilActif.parametres[1].optionChoisie === 'Avec points') {
          SVG += ' <circle cx="' + this.positionX + '" cy="' + this.positionY + '" r="'
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

  shiftEnfonce() {
    const dernierPoint = this.points[this.points.length - 1];
    const angle = Math.atan((this.curseurY - dernierPoint.y) / (this.curseurX - dernierPoint.x));
    const alignement = Math.abs(Math.round(angle / (Math.PI / 4)));

    // alignement = 0 lorsque angle = 0,180­°
    // alignement = 1 lorsque angle = 45,135,225,315°
    // alignement = 2 lorsque angle = 90,270°
    if (alignement === 0) {
      this.positionX = this.curseurX;
      this.positionY = dernierPoint.y;
    } else if (alignement === 1) {
      if (Math.sign(this.curseurX - dernierPoint.x) === Math.sign(this.curseurY - dernierPoint.y)) {
        this.positionY = this.curseurX - dernierPoint.x + dernierPoint.y;
      } else {
        this.positionY = dernierPoint.x - this.curseurX + dernierPoint.y;
      }
      this.positionX = this.curseurX;
    } else if (alignement === 2) {
      this.positionX = dernierPoint.x;
      this.positionY = this.curseurY;
    }

    this.actualiserSVG();
  }

  shiftRelache() {
    this.positionX = this.curseurX;
    this.positionY = this.curseurY;
    this.actualiserSVG();
  }

  actualiserSVG() {
    let SVG = '<polyline fill="none" stroke="black" stroke-width="'
      + this.outils.outilActif.parametres[0].valeur + '" points="';

    for (const point of this.points) {
      SVG += point.x + ' ' + point.y + ' ';
    }

    SVG += this.positionX + ' ' + this.positionY + '"/>';

    if (this.outils.outilActif.parametres[1].optionChoisie === 'Avec points' ) {
      SVG += this.avecPoints(SVG);
    }

    this.stockageSVG.setSVGEnCours(SVG);
  }
}
