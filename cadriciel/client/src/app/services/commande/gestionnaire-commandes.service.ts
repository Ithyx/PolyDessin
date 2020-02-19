import { Injectable } from '@angular/core';
import { Commande } from './commande';

@Injectable({
  providedIn: 'root'
})
export class GestionnaireCommandesService {
  commandesEffectuees: Commande[] = [];
  commandesAnnulees: Commande[] = [];

  executer(commande: Commande) {
    this.commandesEffectuees.push(commande);
    this.commandesAnnulees = [];
  }

  annulerCommande() {
    const commande = this.commandesEffectuees.pop();
    if (commande) {
      commande.annuler();
      this.commandesAnnulees.push(commande);
    }
  }

  refaireCommande() {
    const commande = this.commandesAnnulees.pop();
    if (commande) {
      commande.refaire();
      this.commandesEffectuees.push(commande);
    }
  }
}
