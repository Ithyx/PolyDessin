import { Injectable } from '@angular/core';
import { AjoutSvgService } from '../commande/ajout-svg.service';
import { GestionnaireCommandesService } from '../commande/gestionnaire-commandes.service';
import { ParametresCouleurService } from '../couleur/parametres-couleur.service';
import { StockageSvgService } from '../stockage-svg/stockage-svg.service';
import { TraitCrayonService } from '../stockage-svg/trait-crayon.service';
import { GestionnaireOutilsService } from './gestionnaire-outils.service';
import { InterfaceOutils } from './interface-outils';

@Injectable({
  providedIn: 'root'
})

export class DessinCrayonService implements InterfaceOutils {

  constructor(public stockageSVG: StockageSvgService,
              public outils: GestionnaireOutilsService,
              public couleur: ParametresCouleurService,
              public commandes: GestionnaireCommandesService) { }

  trait = new TraitCrayonService();
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
        this.commandes.executer(new AjoutSvgService(this.trait, this.stockageSVG));
      }
      this.trait = new TraitCrayonService();
      this.commandes.dessinEnCours = false;
      this.peutCliquer = true;
    }
  }

  sourisCliquee(souris: MouseEvent) {
    if (this.peutCliquer) {
      if (this.outils.outilActif.parametres[0].valeur) {
        this.trait.points.push({x: souris.offsetX, y: souris.offsetY});
        this.trait.estPoint = true;
        this.actualiserSVG();
        this.commandes.executer(new AjoutSvgService(this.trait, this.stockageSVG));
        this.trait = new TraitCrayonService();
      }
      this.commandes.dessinEnCours = false;
    } else {this.peutCliquer = true};
  }

  sourisSortie() {
    if (this.commandes.dessinEnCours) {
      this.commandes.executer(new AjoutSvgService(this.trait, this.stockageSVG));
      this.trait = new TraitCrayonService();
      this.commandes.dessinEnCours = false;
    }
    this.peutCliquer = false;
  }

  actualiserSVG() {
    this.trait.couleurPrincipale = this.couleur.getCouleurPrincipale();
    this.trait.outil = this.outils.outilActif;
    this.trait.dessiner();
    this.stockageSVG.setSVGEnCours(this.trait);
  }
}
