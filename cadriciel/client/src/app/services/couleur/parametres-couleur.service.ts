import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParametresCouleurService {
  dernieresCouleurs: string[] = [];

  couleurPrincipale = 'rgba(0, 0, 0, ';
  couleurSecondaire = 'rgba(0, 0, 0, ';

  opacitePrincipale = 1;
  opaciteSecondaire = 1;
  opacitePrincipaleAffichee = 100;
  opaciteSecondaireAffichee = 100;

  couleurFond = 'rgba(255, 255, 255, 1)'

  intervertirCouleurs() {
    const copie = this.couleurPrincipale;
    this.couleurPrincipale = this.couleurSecondaire;
    this.couleurSecondaire = copie;
  }

  getCouleurPrincipale() {
    return this.couleurPrincipale + this.opacitePrincipale + ')';
  }

  getCouleurSecondaire() {
    return this.couleurSecondaire + this.opaciteSecondaire + ')';
  }
}
