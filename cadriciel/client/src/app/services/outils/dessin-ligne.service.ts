import { Injectable } from '@angular/core';
import { AjoutSvgService } from '../commande/ajout-svg.service';
import { GestionnaireCommandesService } from '../commande/gestionnaire-commandes.service';
import { LineService } from '../stockage-svg/line.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
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
  ligne = new LineService();

  curseur: Point = {x: 0, y: 0};

  constructor(public SVGStockage: SVGStockageService,
              public outils: GestionnaireOutilsService,
              public commandes: GestionnaireCommandesService) { }

  sourisDeplacee(souris: MouseEvent) {
    this.curseur = {x: souris.offsetX, y: souris.offsetY};
    if (souris.shiftKey) {
      this.shiftEnfonce();
    } else {
      this.shiftRelache();
    }
  }

  sourisCliquee() {
    this.commandes.dessinEnCours = true;
    this.estClicSimple = true;
    this.ligne.points.push({x: this.ligne.mousePosition.x, y: this.ligne.mousePosition.y});
    window.setTimeout(() => {
      if (this.estClicSimple) {this.actualiserSVG()}
    }, 250);
  }

  sourisDoubleClic(souris: MouseEvent) {
    this.commandes.dessinEnCours = false;
    this.estClicSimple = false;
    if (this.ligne.points.length !== 0) {
      if (Math.abs(souris.offsetX - this.ligne.points[0].x) <= 3
          && Math.abs(souris.offsetY - this.ligne.points[0].y) <= 3) {
        this.ligne.points.pop();
        this.ligne.points.pop();
        this.ligne.isAPolygon = true;
      } else if (this.outils.outilActif.parametres[1].optionChoisie === 'Avec points') {
        this.ligne.points.push({x: this.ligne.mousePosition.x, y: this.ligne.mousePosition.y});
      }
      this.ligne.draw();
      if (!this.ligne.isEmpty()) {
        this.commandes.executer(new AjoutSvgService(this.ligne, this.SVGStockage));
      }
      this.ligne = new LineService();
    }
  }

  retirerPoint() {
    if (this.ligne.points.length > 1) {
      this.ligne.points.pop();
      this.actualiserSVG();
    }
  }

  stockerCurseur() {
    this.positionShiftEnfoncee = {x: this.curseur.x, y: this.curseur.y};
  }

  shiftEnfonce() {
    if (this.commandes.dessinEnCours) {
      const dernierPoint = this.ligne.points[this.ligne.points.length - 1];
      const angle = Math.atan((this.curseur.y - dernierPoint.y) / (this.curseur.x - dernierPoint.x));
      const alignement = Math.abs(Math.round(angle / (Math.PI / 4)));

      // alignement = 0 lorsque angle = 0,180­°
      // alignement = 1 lorsque angle = 45,135,225,315°
      // alignement = 2 lorsque angle = 90,270°
      if (alignement === 0) {
        this.ligne.mousePosition = {x: this.curseur.x, y: dernierPoint.y};
      } else if (alignement === 1) {
        if (Math.sign(this.curseur.x - dernierPoint.x) === Math.sign(this.curseur.y - dernierPoint.y)) {
          this.ligne.mousePosition.y = this.curseur.x - dernierPoint.x + dernierPoint.y;
        } else {
          this.ligne.mousePosition.y = dernierPoint.x - this.curseur.x + dernierPoint.y;
        }
        this.ligne.mousePosition.x = this.curseur.x;
      } else {
        this.ligne.mousePosition = {x: dernierPoint.x, y: this.curseur.y};
      }
      this.actualiserSVG();
    }
  }

  shiftRelache() {
    this.ligne.mousePosition = this.curseur;
    this.actualiserSVG();
  }

  actualiserSVG() {
    this.ligne.tool = this.outils.outilActif;
    this.ligne.draw();
    this.SVGStockage.setOngoingSVG(this.ligne);
  }

  vider() {
    this.ligne = new LineService();
    this.positionShiftEnfoncee = {x: 0, y: 0};
    this.curseur = {x: 0, y: 0};
  }
}
