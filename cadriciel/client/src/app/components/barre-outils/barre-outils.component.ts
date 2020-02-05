import { Component } from '@angular/core';
import { Portee } from 'src/app/services/couleur/gestionnaire-couleurs.service';
import { GestionnaireRaccourcisService } from 'src/app/services/gestionnaire-raccourcis.service';
import { GestionnaireOutilsService, OutilDessin } from 'src/app/services/outils/gestionnaire-outils.service';

@Component({
  selector: 'app-barre-outils',
  templateUrl: './barre-outils.component.html',
  styleUrls: ['./barre-outils.component.scss']
})
export class BarreOutilsComponent {

  porteePrincipale = Portee.Principale;
  porteeSecondaire = Portee.Secondaire;

  constructor(
    public outils: GestionnaireOutilsService,
    public raccourcis: GestionnaireRaccourcisService
  ) {}

  onClick(outil: OutilDessin) {
    this.outils.outilActif.estActif = false;
    this.outils.outilActif = outil;
    this.outils.outilActif.estActif = true;
  }

  onChange(event: Event, nomParametre: string) {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    if (!isNaN(Number(eventCast.value))) {
      this.outils.outilActif.parametres[this.outils.trouverIndexParametre(nomParametre)].valeur = Math.max(Number(eventCast.value), 1);
    }
  }

  onSelect(event: Event, parametreNom: string) {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    if (typeof eventCast.value === 'string') {
      this.outils.outilActif.parametres[this.outils.trouverIndexParametre(parametreNom)].optionChoisie = eventCast.value;
    }
  }

  onChampFocus() {
    this.raccourcis.champDeTexteEstFocus = true;
  }

  onChampBlur() {
    this.raccourcis.champDeTexteEstFocus = false;
  }
}
