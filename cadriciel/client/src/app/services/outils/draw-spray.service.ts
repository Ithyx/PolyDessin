import { Injectable } from '@angular/core';
import { AjoutSvgService } from '../commande/ajout-svg.service';
import { GestionnaireCommandesService } from '../commande/gestionnaire-commandes.service';
import { ParametresCouleurService } from '../couleur/parametres-couleur.service';
import { StockageSvgService } from '../stockage-svg/stockage-svg.service';
import { TraceSprayService } from '../stockage-svg/trace-spray.service';
import { Point } from './dessin-ligne.service';
import { GestionnaireOutilsService } from './gestionnaire-outils.service';
import { InterfaceOutils } from './interface-outils';

@Injectable({
  providedIn: 'root'
})
export class DrawSprayService implements InterfaceOutils {

  constructor(public stockageSVG: StockageSvgService,
              public tools: GestionnaireOutilsService,
              public color: ParametresCouleurService,
              public commands: GestionnaireCommandesService) { }

  trace = new TraceSprayService();
  mousePosition: Point = {x: 0, y: 0};
  intervalMethodID: number;

  sourisDeplacee(souris: MouseEvent) {
    if (this.commands.dessinEnCours) {
      this.mousePosition = {x: souris.offsetX, y: souris.offsetY};
    }
  }

  actualizeSVG() {
    this.trace.couleur = this.color.getCouleurPrincipale();
    this.trace.outil = this.tools.outilActif;
    this.trace.dessiner();
    this.stockageSVG.setSVGEnCours(this.trace);
    console.log(this.trace.SVG)
  }

  sourisEnfoncee(souris: MouseEvent) {
    const frequence = this.tools.outilActif.parametres[1].valeur;
    this.commands.dessinEnCours = true;
    this.mousePosition = {x: souris.offsetX, y: souris.offsetY};
    window.clearInterval(this.intervalMethodID);
    this.intervalMethodID = window.setInterval(() => {
      this.addPoint();
      this.actualizeSVG();
    }, frequence ? 1000 / frequence : 1000);
  }

  addPoint() {
    const diameter = this.tools.outilActif.parametres[0].valeur;
    const position = Math.random() * (diameter ? diameter / 2 : 1);
    const angle = Math.random() * 2 * Math.PI;
    const x = this.mousePosition.x + position * Math.cos(angle);
    const y = this.mousePosition.y + position * Math.sin(angle);
    this.trace.points.push({x, y});
    this.actualizeSVG();
  }

  sourisRelachee() {
    if (this.commands.dessinEnCours) {
      if (this.trace.points.length > 0) {
        this.commands.executer(new AjoutSvgService(this.trace, this.stockageSVG));
      }
    }
    this.trace = new TraceSprayService();
    this.commands.dessinEnCours = false;
    window.clearInterval(this.intervalMethodID);
  }
}
