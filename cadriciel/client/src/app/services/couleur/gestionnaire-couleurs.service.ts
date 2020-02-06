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
