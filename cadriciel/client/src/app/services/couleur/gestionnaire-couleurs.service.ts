import { Injectable } from '@angular/core';

export enum Portee {
  Principale = 1,
  Secondaire,
  Defaut,
}

@Injectable({
  providedIn: 'root'
})
export class GestionnaireCouleursService {
  private couleurPrincipale: string
  private couleurSecondaire: string;
  RGB: number[] = [0, 0, 0];
  alpha: number = 1;

  modifierRGB(portee: Portee) {
    const nouvelleCouleur = 'rgba(' + this.RGB[0] + ', '
                                    + this.RGB[1] + ', '
                                    + this.RGB[2] + ', '
                                    + this.alpha + ')';
    this.setCouleur(portee, nouvelleCouleur);
  }

  setCouleur(portee: Portee, nouvelleCouleur: string) {
    switch (portee) {
      case Portee.Principale:
        console.log('nouvelle couleur principale: ', nouvelleCouleur);
        this.couleurPrincipale = nouvelleCouleur;
        break;
      case Portee.Secondaire:
        console.log('nouvelle couleur secondaire: ', nouvelleCouleur);
        this.couleurSecondaire = nouvelleCouleur;
        break;
      default:
        /* Par mesure de sécurité, ne rien faire. */
        break;
    }
  }

  getPrincipale() {
    return this.couleurPrincipale
  }

  getSecondaire() {
    return this.couleurSecondaire;
  }
}
