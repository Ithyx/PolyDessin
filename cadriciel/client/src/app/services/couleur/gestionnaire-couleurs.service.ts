import { Injectable } from '@angular/core';
import { ChangeBackgroundColorService } from '../commande/change-background-color.service';
import { GestionnaireCommandesService } from '../commande/gestionnaire-commandes.service';
import { ParametresCouleurService } from './parametres-couleur.service'

export enum Portee {
  Principale = 1,
  Secondaire,
  Fond,
  Defaut,
}

export const MAX_COULEURS = 10;

@Injectable({
  providedIn: 'root'
})
export class GestionnaireCouleursService {
  couleur = 'rgba(0, 0, 0,';
  teinte = 'rgba(255,255,255';
  RGB: number[] = [0, 0, 0];

  constructor(public parametresCouleur: ParametresCouleurService,
              public commandes: GestionnaireCommandesService) {}

  getCouleur() {
    return this.couleur + '1)';
  }

  modifierRGB() {
    const nouvelleCouleur = 'rgba(' + this.RGB[0] + ', '
                                    + this.RGB[1] + ', '
                                    + this.RGB[2] + ', ';
    this.couleur = nouvelleCouleur;
  }

  appliquerCouleur(portee: Portee) {
    switch (portee) {
      case Portee.Principale:
        this.parametresCouleur.couleurPrincipale = this.couleur;
        this.ajouterDerniereCouleur();
        break;
      case Portee.Secondaire:
        this.parametresCouleur.couleurSecondaire = this.couleur;
        this.ajouterDerniereCouleur();
        break;
      case Portee.Fond:
        this.commandes.execute(new ChangeBackgroundColorService(this.parametresCouleur, this.couleur + '1)'));
      default:
        /* Par mesure de sécurité, ne rien faire. */
        break;
    }
  }

  ajouterDerniereCouleur() {
    while (this.parametresCouleur.dernieresCouleurs.length >= MAX_COULEURS) {
      this.parametresCouleur.dernieresCouleurs.shift();
    }
    this.parametresCouleur.dernieresCouleurs.push(this.couleur);
  }
}
