import { Component, Input } from '@angular/core';
import { GestionnaireCouleursService } from 'src/app/services/couleur/gestionnaire-couleurs.service';
import { GestionnaireRaccourcisService } from 'src/app/services/gestionnaire-raccourcis.service';

@Component({
  selector: 'app-valeur-couleur',
  templateUrl: './valeur-couleur.component.html',
  styleUrls: ['./valeur-couleur.component.scss']
})
export class ValeurCouleurComponent {
  @Input() gestionnaireCouleur: GestionnaireCouleursService;

  readonly INDEX_ROUGE = 0;
  readonly INDEX_VERT = 1;
  readonly INDEX_BLEU = 2;

  readonly LETTRES_ACCEPTEE = new Set(['a', 'b', 'c', 'd', 'e', 'f']);

  constructor(public raccourcis: GestionnaireRaccourcisService) {}

  modificationRGB(event: Event, index: number) {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    let value = parseInt(eventCast.value, 16);
    console.log(value);

    if (isNaN(value)) {
      value = 0;
    }

    this.gestionnaireCouleur.RGB[index] = Math.min(value, 255);
    this.gestionnaireCouleur.modifierRGB();
  }

  verifierEntree(clavier: KeyboardEvent): boolean {
    const resultat = clavier.key.toLowerCase();
    return ((resultat >= '0' && resultat <= '9') || (this.LETTRES_ACCEPTEE.has(resultat)) || (resultat === 'backspace'));
  }

  onChampFocus() {
    this.raccourcis.champDeTexteEstFocus = true;
  }

  onChampBlur() {
    this.raccourcis.champDeTexteEstFocus = false;
  }
}
