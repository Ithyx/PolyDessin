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

  INDEX_ROUGE = 0;
  INDEX_VERT = 1;
  INDEX_BLEU = 2;

  readonly LETTRES_ACCEPTEE = new Set(['a', 'b', 'c', 'd', 'e', 'f']);

  constructor(public raccourcis: GestionnaireRaccourcisService) {}

  modificationRGB(evenement: Event, index: number) {
    const eventCast: HTMLInputElement = (evenement.target as HTMLInputElement);
    let valeur = parseInt(eventCast.value, 16);

    if (isNaN(valeur)) {
      valeur = 0;
    }

    // Vérification qu'on essaie d'accéder à un index possible
    if (index <= this.gestionnaireCouleur.RGB.length) {
      this.gestionnaireCouleur.RGB[index] = Math.min(valeur, 255);
      this.gestionnaireCouleur.modifierRGB();
    }
  }

  verifierEntree(clavier: KeyboardEvent): boolean {
    const resultat = clavier.key.toLowerCase();

    const estUnNombreAcceptee = resultat >= '0' && resultat <= '9';
    const estUneLettreAcceptee = this.LETTRES_ACCEPTEE.has(resultat);

    return (estUnNombreAcceptee || estUneLettreAcceptee || (resultat === 'backspace'));
  }

  desactiverRaccourcis() {
    this.raccourcis.champDeTexteEstFocus = true;
  }

  activerRaccourcis() {
    this.raccourcis.champDeTexteEstFocus = false;
  }
}
