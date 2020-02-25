import { Injectable } from '@angular/core';
import { AjoutSvgService } from '../commande/ajout-svg.service';
import { GestionnaireCommandesService } from '../commande/gestionnaire-commandes.service';
import { ParametresCouleurService } from '../couleur/parametres-couleur.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { TraceBrushService } from '../stockage-svg/trace-brush.service';
import { GestionnaireOutilsService } from './gestionnaire-outils.service';
import { InterfaceOutils } from './interface-outils';

@Injectable({
  providedIn: 'root'
})
export class DessinPinceauService implements InterfaceOutils {

  constructor(public SVGStockage: SVGStockageService,
              public outils: GestionnaireOutilsService,
              public couleur: ParametresCouleurService,
              public commandes: GestionnaireCommandesService) { }

  trait = new TraceBrushService();
  peutCliquer = true;

  sourisDeplacee(souris: MouseEvent) {
    if (this.commandes.dessinEnCours) {
      this.trait.points.push({x: souris.offsetX, y: souris.offsetY});
      this.actualiserSVG();
    }
  }

  sourisEnfoncee() {
    this.commandes.dessinEnCours = true;
    this.actualiserSVG();
  }

  sourisRelachee() {
    if (this.commandes.dessinEnCours) {
      if (this.trait.SVG.includes('L')) {
        // on ne stocke le path que s'il n'y a au moins une ligne
        this.commandes.executer(new AjoutSvgService(this.trait, this.SVGStockage));
      }
      this.trait = new TraceBrushService();
      this.commandes.dessinEnCours = false;
      this.peutCliquer = true;
    }
  }

  sourisCliquee(souris: MouseEvent) {
    if (this.peutCliquer) {
      if (this.outils.outilActif.parametres[0].valeur) {
        this.trait.points.push({x: souris.offsetX, y: souris.offsetY});
        this.trait.isAPoint = true;
        this.actualiserSVG();
        this.commandes.executer(new AjoutSvgService(this.trait, this.SVGStockage));
        this.trait = new TraceBrushService();
      }
      this.commandes.dessinEnCours = false;
    } else {this.peutCliquer = true};
  }

  sourisSortie() {
    if (this.commandes.dessinEnCours) {
      this.commandes.executer(new AjoutSvgService(this.trait, this.SVGStockage));
      this.trait = new TraceBrushService();
      this.commandes.dessinEnCours = false;
    }
    this.peutCliquer = false;
  }

  actualiserSVG() {
    this.trait.primaryColor = this.couleur.getCouleurPrincipale();
    this.trait.tool = this.outils.outilActif;
    this.trait.draw();
    this.SVGStockage.setOngoingSVG(this.trait);
  }
}
