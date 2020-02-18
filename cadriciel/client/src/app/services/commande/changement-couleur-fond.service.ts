import { Injectable } from '@angular/core';
import { ParametresCouleurService } from '../couleur/parametres-couleur.service';
import { Commande } from './commande';

@Injectable({
  providedIn: 'root'
})
export class ChangementCouleurFondService implements Commande {
  ancienneCouleur: string;

  constructor(public couleur: ParametresCouleurService, public nouvelleCouleur: string) {
    this.ancienneCouleur = couleur.couleurFond;
    couleur.couleurFond = nouvelleCouleur;
  }

  annuler() {
    this.couleur.couleurFond = this.ancienneCouleur;
  }

  refaire() {
    this.couleur.couleurFond = this.nouvelleCouleur;
  }
}
