import { Injectable } from '@angular/core';
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
              public couleur: ParametresCouleurService) { }

  trait = new TraitCrayonService();
  traitEnCours = false;
  peutCliquer = true;

  sourisDeplacee(souris: MouseEvent) {
    if (this.traitEnCours) {
      this.trait.points.push({x: souris.offsetX, y: souris.offsetY});
      this.actualiserSVG();
    }
  }

  sourisEnfoncee() {
    this.traitEnCours = true;
    this.actualiserSVG();
  }

  sourisRelachee() {
    if (this.traitEnCours) {
      if (this.trait.SVG.includes('L')) {
        // on ne stocke le path que s'il n'y a au moins une ligne
        this.stockageSVG.ajouterSVG(this.trait);
      }
      this.trait = new TraitCrayonService();
      this.traitEnCours = false;
      this.peutCliquer = true;
    }
  }

  sourisCliquee(souris: MouseEvent) {
    if (this.peutCliquer) {
      if (this.outils.outilActif.parametres[0].valeur) {
        this.trait.points.push({x: souris.offsetX, y: souris.offsetY});
        this.trait.estPoint = true;
        this.actualiserSVG();
        this.stockageSVG.ajouterSVG(this.trait);
        this.trait = new TraitCrayonService();
      }
      this.traitEnCours = false;
    } else {this.peutCliquer = true};
  }

  sourisSortie() {
    if (this.traitEnCours) {
      this.stockageSVG.ajouterSVG(this.trait);
      this.trait = new TraitCrayonService();
      this.traitEnCours = false;
    }
    this.peutCliquer = false;
  }

  actualiserSVG() {
    this.trait.couleur = this.couleur.getCouleurPrincipale();
    this.trait.outil = this.outils.outilActif;
    this.trait.dessiner();
    this.stockageSVG.setSVGEnCours(this.trait);
  }
}
