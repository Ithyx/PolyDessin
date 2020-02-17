import { Injectable } from '@angular/core';
import { StockageSvgService } from '../stockage-svg.service';
import { GestionnaireOutilsService, INDEX_OUTIL_SELECTION } from './gestionnaire-outils.service';
import { InterfaceOutils } from './interface-outils';

@Injectable({
  providedIn: 'root'
})
export class SelectionService implements InterfaceOutils {

  constructor(public stockageSVG: StockageSvgService,
              public outils: GestionnaireOutilsService,
             ) { }

  // Cliquee sélectionne l'objet
  sourisCliquee(evenement: MouseEvent, cle: number) {
    if (this.outils.outilActif.ID === INDEX_OUTIL_SELECTION) {
      console.log('selection', evenement, cle);

    }
  }

  // Garder la souris enfoncee créait un rectangle de sélection

  // Méthode pour la création de la "hitbox"

}
