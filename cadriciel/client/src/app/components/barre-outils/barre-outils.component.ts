import { Component, OnInit } from '@angular/core';

const outils = [
  {
    nom: 'Crayon'
  },
  {
    nom: 'Pinceau'
  },
  {
    nom: 'Rectangle'
  },
  {
    nom: 'Ligne'
  },
  {
    nom: 'Couleur primaire'
  },
  {
    nom: 'Couleur secondaire'
  }
];

@Component({
  selector: 'app-barre-outils',
  templateUrl: './barre-outils.component.html',
  styleUrls: ['./barre-outils.component.scss']
})
export class BarreOutilsComponent implements OnInit {
  outils = outils;
  constructor() { }

  ngOnInit() {
  }

}
