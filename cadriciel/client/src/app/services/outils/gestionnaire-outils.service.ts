import { Injectable } from '@angular/core';

export interface ParametreOutil {
  type: string;
  nom: string;
  options?: string[];
  valeur ?: number;
}

export interface OutilDessin {
  nom: string;
  estActif: boolean;
  ID: number;
  parametres: ParametreOutil[];
}

@Injectable({
  providedIn: 'root'
})
export class GestionnaireOutilsService {
  outilActif: OutilDessin = LISTE_OUTILS[0];
  listeOutils: OutilDessin[] = LISTE_OUTILS;

}

export const OUTIL_VIDE = {nom: 'defaut', estActif: false, ID: -1, parametres: []};

export const LISTE_OUTILS: OutilDessin[] = [
  {
    nom: 'Crayon',
    estActif: true,
    ID: 0,
    parametres: [
      {type: 'number', nom: 'Épaisseur'}
    ]
  },
  {
    nom: 'Pinceau',
    estActif: false,
    ID: 1,
    parametres: [
      {type: 'number', nom: 'Épaisseur'},
      {type: 'select', nom: 'Texture', options: ['Texture1', 'Texture2', 'Texture3', 'Texture4', 'Texture5']}
    ]
  },
  {
    nom: 'Rectangle',
    estActif: false,
    ID: 2,
    parametres: [
      {type: 'number', nom: 'Épaisseur du contour'},
      {type: 'select', nom: 'Type de tracé', options: ['Contour', 'Plein', 'Plein avec contour']}
    ]
  },
  {
    nom: 'Ligne',
    estActif: false,
    ID: 3,
    parametres: [
      {type: 'number', nom: 'Épaisseur'},
      {type: 'select', nom: 'Type de jonction', options: ['Avec points', 'Sans points']},
      {type: 'number', nom: 'Diamètre des jonctions'}
    ]
  },
  {
    nom: 'Couleur primaire',
    estActif: false,
    ID: 4,
    parametres: []
  },
  {
    nom: 'Couleur secondaire',
    estActif: false,
    ID: 5,
    parametres: []
  }
];
