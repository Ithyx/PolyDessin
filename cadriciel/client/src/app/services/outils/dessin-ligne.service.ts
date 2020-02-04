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

  constructor(public stockageSVG: StockageSvgService, public outils: GestionnaireOutilsService) { }
  sourisDeplacee(souris: MouseEvent) {
    let SVG = '<polyline fill="none" stroke="black" stroke-width="'
            + this.outils.outilActif.parametres[0].valeur + '" points="';

    for (const point of this.points) {
      SVG += point.x + ' ' + point.y + ' ';
    }

    SVG += souris.offsetX + ' ' + souris.offsetY + '"/>';

    if (this.outils.outilActif.parametres[1].optionChoisie === 'Avec points' ) {
      SVG += this.avecPoint(SVG);
    }

    this.stockageSVG.setSVGEnCours(SVG);
  }
  sourisEnfoncee(souris: MouseEvent) {
    /**/
  }
  sourisRelachee(souris: MouseEvent) {
    /**/
  }
  sourisCliquee(souris: MouseEvent) {
    this.estClicSimple = true;
    const x = souris.offsetX;
    const y = souris.offsetY;
    this.points.push({x, y});
    window.setTimeout(() => {
      if (this.estClicSimple) {this.detectionSimpleClic(x, y)}
    }, 250)
  }
  sourisSortie(souris: MouseEvent) {
    /**/
  }
  sourisEntree(souris: MouseEvent) {
    /**/
  }
  detectionSimpleClic(x: number, y: number) {
    this.points.push({x, y});
    let SVG = '<polyline fill="none" stroke="black" stroke-width="'
            + this.outils.outilActif.parametres[0].valeur + '" points="';

    for (const point of this.points) {
      SVG += ' ' + point.x + ' ' + point.y;
    }

    SVG += '" />';

    if (this.outils.outilActif.parametres[1].optionChoisie === 'Avec points' ) {
      SVG += this.avecPoint(SVG);
    }

    this.stockageSVG.setSVGEnCours(SVG);
  }

  sourisDoubleClic(souris: MouseEvent) {
    this.estClicSimple = false;
    this.detectionDoubleClic(souris);
  }
  detectionDoubleClic(souris: MouseEvent) {
    if (this.points.length !== 0) {
      this.stockageSVG.ajouterSVG(this.stockageSVG.getSVGEnCours() + '" />');
      this.stockageSVG.setSVGEnCours('');
      this.points = [];
    }
  }

  avecPoint(SVG: string): string {
    for (const point of this.points) {
      SVG += ' <circle cx="' + point.x + '" cy="' + point.y + '" r="'
      + this.outils.outilActif.parametres[2].valeur  + '" fill="black"/>';
    }

    return SVG;
  }
}
