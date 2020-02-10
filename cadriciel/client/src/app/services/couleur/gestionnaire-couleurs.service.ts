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
  teinte: string;
  RGB: number[] = [0, 0, 0];
  alpha = 1;

  constructor(public parametresCouleur: ParametresCouleurService) {}

  modifierRGB(portee: Portee) {
    const nouvelleCouleur = 'rgba(' + this.RGB[0] + ', '
                                    + this.RGB[1] + ', '
                                    + this.RGB[2] + ', '
                                    + this.alpha + ')';
    this.setCouleur(portee, nouvelleCouleur);
  }

  setCouleur(portee: Portee, nouvelleCouleur: string) {
    console.log('Portée: ', portee);
    switch (portee) {
      case Portee.Principale:
        console.log('nouvelle couleur principale: ', nouvelleCouleur);
        this.parametresCouleur.couleurPrincipale = nouvelleCouleur;
        break;
      case Portee.Secondaire:
        console.log('nouvelle couleur secondaire: ', nouvelleCouleur);
        this.parametresCouleur.couleurSecondaire = nouvelleCouleur;
        break;
      default:
        /* Par mesure de sécurité, ne rien faire. */
        break;
    }
  }
}
