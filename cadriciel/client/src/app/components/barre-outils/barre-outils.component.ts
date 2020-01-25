import { Component, OnInit } from '@angular/core';
import { OutilDessin, outils } from '../outil-dessin/outil-dessin.component';

@Component({
  selector: 'app-barre-outils',
  templateUrl: './barre-outils.component.html',
  styleUrls: ['./barre-outils.component.scss']
})
export class BarreOutilsComponent implements OnInit {
  outils: OutilDessin[] = outils;
  constructor() { }

  ngOnInit() {
  }

  onNotify(outil: OutilDessin) {
    //TODO: Changer l'outil actif, actualiser le tableau d'attributs.
  }

}
