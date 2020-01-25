import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export class OutilDessin {
  public nom: string;
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
    this.notification.emit(this.outil);
  }

}

export const outils: OutilDessin[] = [
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
