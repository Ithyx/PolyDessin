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

  onKey(event: any, nomParametre: string) {
    this.outils.outilActif.parametres[this.outils.trouverIndexParametre(nomParametre)].valeur = event.target.value;
  }
}
