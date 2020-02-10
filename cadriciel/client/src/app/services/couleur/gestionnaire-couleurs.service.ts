import { Injectable } from '@angular/core';
import { ParametresCouleurService } from './parametres-couleur.service'

export enum Portee {
  Principale = 1,
  Secondaire,
  Defaut,
}

@Injectable({
  providedIn: 'root'
})
export class GestionnaireCouleursService {
  couleur: string;
  teinte: string;
  RGB: number[] = [0, 0, 0];
  alpha = 1;

  constructor(public parametresCouleur: ParametresCouleurService) {}

  modifierRGB() {
    const nouvelleCouleur = 'rgba(' + this.RGB[0] + ', '
                                    + this.RGB[1] + ', '
                                    + this.RGB[2] + ', '
                                    + this.alpha + ')';
    this.couleur = nouvelleCouleur;
  }

  appliquerCouleur(portee: Portee) {
    switch (portee) {
      case Portee.Principale:
        console.log('nouvelle couleur principale: ', this.couleur);
        this.parametresCouleur.couleurPrincipale = this.couleur;
        break;
      case Portee.Secondaire:
        console.log('nouvelle couleur secondaire: ', this.couleur);
        this.parametresCouleur.couleurSecondaire = this.couleur;
        break;
      default:
        /* Par mesure de sécurité, ne rien faire. */
        break;
    }
  }
}
