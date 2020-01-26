import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export class OutilDessin {
  public nom: string;
  public estActif: boolean;
  public idOutil: number;
}

@Component({
  selector: 'app-outil-dessin',
  templateUrl: './outil-dessin.component.html',
  styleUrls: ['./outil-dessin.component.scss']
})
export class OutilDessinComponent implements OnInit {

  @Input() public outil: OutilDessin;
  @Output() public notification = new EventEmitter<OutilDessin>();

  constructor() { }

  ngOnInit() {
  }

  onClick() {
    // Devient l'outil actif.
    this.outil.estActif = true;
    this.notification.emit(this.outil);
  }

}

export const outils: OutilDessin[] = [
  {
    nom: 'Crayon',
    estActif: true,
    idOutil: 0
  },
  {
    nom: 'Pinceau',
    estActif: false,
    idOutil: 1
  },
  {
    nom: 'Rectangle',
    estActif: false,
    idOutil: 2
  },
  {
    nom: 'Ligne',
    estActif: false,
    idOutil: 3
  },
  {
    nom: 'Couleur primaire',
    estActif: false,
    idOutil: 4
  },
  {
    nom: 'Couleur secondaire',
    estActif: false,
    idOutil: 5
  }
];
