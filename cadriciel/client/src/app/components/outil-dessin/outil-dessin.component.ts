import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface ParametreOutil {
  type: string;
  nom: string;
  options?: string[];
  valeur ?: number;
}

export interface OutilDessin {
  nom: string;
  estActif: boolean;
  idOutil: number;
  parametres: ParametreOutil[];
}

@Component({
  selector: 'app-outil-dessin',
  templateUrl: './outil-dessin.component.html',
  styleUrls: ['./outil-dessin.component.scss']
})
export class OutilDessinComponent {

  // Valeur par défaut pour les unit test
  @Input() outil: OutilDessin = {nom: 'defaut', estActif: false, idOutil: -1, parametres: []};
  @Output() notification = new EventEmitter<OutilDessin>();

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
    idOutil: 0,
    parametres: [
      {type: 'number', nom: 'Épaisseur'}
    ]
  },
  {
    nom: 'Pinceau',
    estActif: false,
    idOutil: 1,
    parametres: [
      {type: 'number', nom: 'Épaisseur'},
      {type: 'select', nom: 'Texture', options: ['Texture1', 'Texture2', 'Texture3', 'Texture4', 'Texture5']}
    ]
  },
  {
    nom: 'Rectangle',
    estActif: false,
    idOutil: 2,
    parametres: [
      {type: 'number', nom: 'Épaisseur du contour'},
      {type: 'select', nom: 'Type de tracé', options: ['Contour', 'Plein', 'Plein avec contour']}
    ]
  },
  {
    nom: 'Ligne',
    estActif: false,
    idOutil: 3,
    parametres: [
      {type: 'number', nom: 'Épaisseur'},
      {type: 'select', nom: 'Type de jonction', options: ['Avec points', 'Sans points']},
      {type: 'number', nom: 'Diamètre des jonctions'}
    ]
  },
  {
    nom: 'Couleur primaire',
    estActif: false,
    idOutil: 4,
    parametres: []
  },
  {
    nom: 'Couleur secondaire',
    estActif: false,
    idOutil: 5,
    parametres: []
  }
];
