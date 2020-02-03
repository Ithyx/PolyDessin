import { Component } from '@angular/core';
import { GestionnaireOutilsService, OutilDessin } from 'src/app/services/outils/gestionnaire-outils.service';

@Component({
  selector: 'app-barre-outils',
  templateUrl: './barre-outils.component.html',
  styleUrls: ['./barre-outils.component.scss']
})
export class BarreOutilsComponent {
  constructor(
    public outils: GestionnaireOutilsService
  ) {}

  onClick(outil: OutilDessin) {
    this.outils.outilActif.estActif = false;
    this.outils.outilActif = outil;
    this.outils.outilActif.estActif = true;
  }

  onChange(event: Event, nomParametre: string) {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    if (Number(eventCast.value) > 0 && !isNaN(Number(eventCast.value))) {
      this.outils.outilActif.parametres[this.outils.trouverIndexParametre(nomParametre)].valeur = Number(eventCast.value);
    }
  }

  onSelect(event: Event, parametreNom: string) {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    if (typeof eventCast.value === 'string') {
      this.outils.outilActif.parametres[this.outils.trouverIndexParametre(parametreNom)].optionChoisie = eventCast.value;
    }
  }
}
