import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParametresCouleurService {
  dernieresCouleurs: string[] = [];
  couleurPrincipale = 'rgba(0, 0, 0, 1)';
  couleurSecondaire = 'rgba(0, 0, 0, 1)';
  couleurFond = 'rgba(255, 255, 255, 1)'

  intervertirCouleurs() {
    const copie = this.couleurPrincipale;
    this.couleurPrincipale = this.couleurSecondaire;
    this.couleurSecondaire = copie;
  }
}
