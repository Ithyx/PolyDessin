import { Component, OnInit } from '@angular/core';
import { OutilDessin, outils } from '../outil-dessin/outil-dessin.component';

@Component({
  selector: 'app-barre-outils',
  templateUrl: './barre-outils.component.html',
  styleUrls: ['./barre-outils.component.scss']
})
export class BarreOutilsComponent implements OnInit {
  outils: OutilDessin[] = outils;
  idOutilActif: number = 0;
  constructor() { }

  ngOnInit() {
  }

  onNotify(outil: OutilDessin) {
    if (outil.idOutil != this.idOutilActif)
    {
      // Changer l'outil actif et en garder une référence.
      this.outils[this.idOutilActif].estActif = false;
      this.idOutilActif = outil.idOutil;
      //TODO: faire en sorte que si on change de page (ex. guide d'utilisation) et revient,
      //l'outil actif se déselectionne en cliquant sur un autre outil.
    }
    //TODO: actualiser le panneau d'attributs.
  }

}
