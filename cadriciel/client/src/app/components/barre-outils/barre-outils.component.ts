import { Component, EventEmitter, Output } from '@angular/core';
import { OutilDessin, outils } from '../outil-dessin/outil-dessin.component';

@Component({
  selector: 'app-barre-outils',
  templateUrl: './barre-outils.component.html',
  styleUrls: ['./barre-outils.component.scss']
})
export class BarreOutilsComponent {
  @Output() notifieur = new EventEmitter<OutilDessin>();

  outils: OutilDessin[] = outils;
  outilActif: OutilDessin = outils[0];
  idOutilActif = 0;

  onNotify(outil: OutilDessin) {
    console.log('emmitting: ', outil);
    this.notifieur.emit(outil);
    if (outil.idOutil !== this.idOutilActif) {
        // Changer l'outil actif et en garder une référence.
        this.outils[this.idOutilActif].estActif = false;
        this.idOutilActif = outil.idOutil;
        this.outilActif = outil;
        // TODO: faire en sorte que si on change de page (ex. guide d'utilisation) et revient,
        // l'outil actif se déselectionne en cliquant sur un autre outil.
      }
  }
}
