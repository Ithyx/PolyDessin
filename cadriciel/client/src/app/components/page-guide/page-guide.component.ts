import { Component, OnInit } from '@angular/core';

const onglets = [
  {
    nom: 'Bienvenue',
    description: 'Bienvenue dans PolyDessin...',
    suivant: ''
  },
  {
    nom: 'Dessins',
    sousOnglets: '',
    description: '',
    precedant: '',
    suivant: ''
  },
  {
    nom: 'Outils',
    sousOnglets: '',
    description: '',
    precedant: ''
  }
];

@Component({
  selector: 'app-page-guide',
  templateUrl: './page-guide.component.html',
  styleUrls: ['./page-guide.component.scss']
})

export class PageGuideComponent implements OnInit {
  onglets = onglets;
  constructor() { }

  ngOnInit() {
  }

}
