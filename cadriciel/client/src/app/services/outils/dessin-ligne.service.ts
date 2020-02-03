import { Injectable } from '@angular/core';
import { StockageSvgService } from '../stockage-svg.service';
import { GestionnaireOutilsService } from './gestionnaire-outils.service';

export interface Point {
  x: number;
  y: number;
}

@Injectable({
  providedIn: 'root'
})
export class DessinLigneService {
  points: Point[];
  constructor(public stockageSVG: StockageSvgService, public outils: GestionnaireOutilsService) { }
}
