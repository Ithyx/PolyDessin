import { Injectable } from '@angular/core';
import { LigneService } from '../stockage-svg/ligne.service';
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
  private estClicSimple = true;
  positionShiftEnfoncee: Point;
  ligne = new LigneService();

  curseur: Point = {x: 0, y: 0};

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
    this.ligne.points.push({x: this.ligne.positionSouris.x, y: this.ligne.positionSouris.y});
    window.setTimeout(() => {
      if (this.estClicSimple) {this.actualiserSVG()}
    }, 250);
  }

  sourisDoubleClic(souris: MouseEvent) {
    this.estClicSimple = false;
    if (this.ligne.points.length !== 0) {
      if (Math.abs(souris.offsetX - this.ligne.points[0].x) <= 3
          && Math.abs(souris.offsetY - this.ligne.points[0].y) <= 3) {
        this.ligne.points.pop();
        this.ligne.points.pop();
        this.ligne.estPolygone = true;
      } else {
        if (this.outils.outilActif.parametres[1].optionChoisie === 'Avec points') {
          this.ligne.points.push({x: this.ligne.positionSouris.x, y: this.ligne.positionSouris.y});
        }
      }
      this.ligne.dessiner();
      this.stockageSVG.ajouterSVG(this.ligne.SVG);
      this.stockageSVG.setSVGEnCours('');
      this.ligne = new LigneService();
    }
  }

  retirerPoint() {
    if (this.ligne.points.length > 1) {
      this.ligne.points.pop();
      this.actualiserSVG();
    }
  }

  annulerLigne() {
    this.stockageSVG.setSVGEnCours('');
    this.ligne = new LigneService();
  }

  stockerCurseur() {
    this.positionShiftEnfoncee = {x: this.curseur.x, y: this.curseur.y};
  }

  shiftEnfonce() {
    const dernierPoint = this.ligne.points[this.ligne.points.length - 1];
    const angle = Math.atan((this.curseur.y - dernierPoint.y) / (this.curseur.x - dernierPoint.x));
    const alignement = Math.abs(Math.round(angle / (Math.PI / 4)));

    // alignement = 0 lorsque angle = 0,180­°
    // alignement = 1 lorsque angle = 45,135,225,315°
    // alignement = 2 lorsque angle = 90,270°
    if (alignement === 0) {
      this.ligne.positionSouris.x = this.curseur.x;
      this.ligne.positionSouris.y = dernierPoint.y;
    } else if (alignement === 1) {
      if (Math.sign(this.curseur.x - dernierPoint.x) === Math.sign(this.curseur.y - dernierPoint.y)) {
        this.ligne.positionSouris.y = this.curseur.x - dernierPoint.x + dernierPoint.y;
      } else {
        this.ligne.positionSouris.y = dernierPoint.x - this.curseur.x + dernierPoint.y;
      }
      this.ligne.positionSouris.x = this.curseur.x;
    } else {
      this.ligne.positionSouris.x = dernierPoint.x;
      this.ligne.positionSouris.y = this.curseur.y;
    }

    this.actualiserSVG();
  }

  shiftRelache() {
    this.ligne.positionSouris.x = this.curseur.x;
    this.ligne.positionSouris.y = this.curseur.y;
    this.actualiserSVG();
  }

  actualiserSVG() {
    this.ligne.outil = this.outils.outilActif;
    this.ligne.dessiner();
    this.stockageSVG.setSVGEnCours(this.ligne.SVG);
  }

  vider() {
    this.ligne = new LigneService();
    this.positionShiftEnfoncee = {x: 0, y: 0};
    this.curseur.x = 0;
    this.curseur.y = 0;
    this.stockageSVG.setSVGEnCours('');
  }
}
