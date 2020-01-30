import { Component, EventEmitter, Output } from '@angular/core';
import { GestionnaireOutilsService, OutilDessin } from 'src/app/services/outils/gestionnaire-outils.service';

@Component({
  selector: 'app-barre-outils',
  templateUrl: './barre-outils.component.html',
  styleUrls: ['./barre-outils.component.scss']
})
export class BarreOutilsComponent {
  @Output() notifieur = new EventEmitter<OutilDessin>();
  @Output() parametre = new EventEmitter<number>();

  constructor(
    private outils: GestionnaireOutilsService
  ) {}

  onClick(outil: OutilDessin) {
    this.outils.outilActif.estActif = false;
    this.outils.outilActif = outil;
    this.outils.outilActif.estActif = true;
  }
}
