import { Component, Input } from '@angular/core';
import { GestionnaireCouleursService, Portee } from 'src/app/services/couleur/gestionnaire-couleurs.service';
import { GestionnaireRaccourcisService } from 'src/app/services/gestionnaire-raccourcis.service';

@Component({
  selector: 'app-valeur-couleur',
  templateUrl: './valeur-couleur.component.html',
  styleUrls: ['./valeur-couleur.component.scss']
})
export class ValeurCouleurComponent {
  @Input() portee: Portee = Portee.Principale;
  @Input() couleur: GestionnaireCouleursService;

  readonly INDEX_ROUGE = 0;
  readonly INDEX_VERT = 1;
  readonly INDEX_BLEU = 2;

  constructor(public raccourcis: GestionnaireRaccourcisService) {}

  modificationRGB(event: Event, index: number) {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    if (!isNaN(Number(eventCast.value))) {
      this.couleur.RGB[index] = Math.min(Math.max(Number(eventCast.value), 0), 255);
      this.couleur.modifierRGB(this.portee);
    }
  }

  onChampFocus() {
    this.raccourcis.champDeTexteEstFocus = true;
  }

  onChampBlur() {
    this.raccourcis.champDeTexteEstFocus = false;
  }
}
