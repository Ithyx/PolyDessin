import { Component } from '@angular/core';
import { GestionnaireCouleursService } from 'src/app/services/couleur/gestionnaire-couleurs.service';
import { GestionnaireRaccourcisService } from 'src/app/services/gestionnaire-raccourcis.service';

@Component({
  selector: 'app-valeur-couleur',
  templateUrl: './valeur-couleur.component.html',
  styleUrls: ['./valeur-couleur.component.scss']
})
export class ValeurCouleurComponent {

  readonly INDEX_ROUGE = 0;
  readonly INDEX_VERT = 1;
  readonly INDEX_BLEU = 2;

  constructor(public raccourcis: GestionnaireRaccourcisService,
              public gestionnaireCouleur: GestionnaireCouleursService) {}

  modificationRGB(event: Event, index: number) {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    if (!isNaN(Number(eventCast.value))) {
      this.gestionnaireCouleur.RGB[index] = Math.min(Math.max(Number(eventCast.value), 0), 255);
      this.gestionnaireCouleur.modifierRGB();
    }
  }

  onChampFocus() {
    this.raccourcis.champDeTexteEstFocus = true;
  }

  onChampBlur() {
    this.raccourcis.champDeTexteEstFocus = false;
  }
}
