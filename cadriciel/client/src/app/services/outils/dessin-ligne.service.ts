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
  constructor(public stockageSVG: StockageSvgService, public outils: GestionnaireOutilsService) { }
  sourisDeplacee(souris: MouseEvent) {
    let SVG = '<polyline fill="none" stroke="black" stroke-width="'
            + this.outils.outilActif.parametres[0].valeur + '" points="';

    for (const point of this.points) {
      SVG += point.x + ' ' + point.y + ' ';
    }

    SVG += souris.offsetX + ' ' + souris.offsetY + '"/>';
    this.stockageSVG.setSVGEnCours(SVG);
  }
  sourisEnfoncee(souris: MouseEvent) {
    /**/
  }
  sourisRelachee(souris: MouseEvent) {
    /**/
  }
  sourisCliquee(souris: MouseEvent) {
    console.log('click');
    this.points.push({x: souris.offsetX, y: souris.offsetY});
    let SVG = '<polyline fill="none" stroke="black" stroke-width="'
            + this.outils.outilActif.parametres[0].valeur + '" points="';

    for (const point of this.points) {
      SVG += ' ' + point.x + ' ' + point.y;
    }

    SVG += '"/>';
    this.stockageSVG.setSVGEnCours(SVG);
  }
  sourisSortie(souris: MouseEvent) {
    /**/
  }
  sourisEntree(souris: MouseEvent) {
    /**/
  }
  sourisDoubleClic(souris: MouseEvent) {
    console.log('double click');
  }
}
