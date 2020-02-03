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
  points: Point[];
  constructor(public stockageSVG: StockageSvgService, public outils: GestionnaireOutilsService) { }
  sourisDeplacee(evenement: MouseEvent) {
    /**/
  }
  sourisEnfoncee(evenement: MouseEvent) {
    /**/
  }
  sourisRelachee(evenement: MouseEvent) {
    /**/
  }
  sourisCliquee(evenement: MouseEvent) {
    /**/
  }
  sourisSortie(evenement: MouseEvent) {
    /**/
  }
  sourisEntree(evenement: MouseEvent) {
    /**/
  }
  sourisDoubleClic(souris: MouseEvent) {
    /**/
  }
}
