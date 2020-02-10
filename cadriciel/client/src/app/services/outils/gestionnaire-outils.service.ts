import { Injectable } from '@angular/core';

export const INDEX_OUTIL_CRAYON = 0;
export const INDEX_OUTIL_PINCEAU = 1;
export const INDEX_OUTIL_RECTANGLE = 2;
export const INDEX_OUTIL_LIGNE = 3;

export interface ParametreOutil {
  type: string;
  nom: string;
  options?: string[];
  optionChoisie?: string;
  valeur?: number;
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

  trouverIndexParametre(nom: string): number {
    for (let i = 0; i < this.outilActif.parametres.length; i++) {
      if ( this.outilActif.parametres[i].nom === nom) {
        return i;
      }
    }
    // Autrement on renvoie le premier parametre de l'outil
    return 0;
  }

  changerOutilActif(index: number) {
    // On vérifie qu'on essaye d'accéder à un index valide
    if (index <= this.listeOutils.length) {
      this.outilActif.estActif = false;
      this.outilActif = this.listeOutils[index];
      this.outilActif.estActif = true;
    }
  }
}

export const OUTIL_VIDE = {nom: 'defaut', estActif: false, ID: -1, parametres: []};

export const LISTE_OUTILS: OutilDessin[] = [
  {
    nom: 'Crayon',
    estActif: true,
    ID: 0,
    parametres: [
      {type: 'number', nom: 'Épaisseur', valeur: 5}
    ]
  },
  {
    nom: 'Pinceau',
    estActif: false,
    ID: 1,
    parametres: [
      {type: 'number', nom: 'Épaisseur', valeur: 5},
      {type: 'select', nom: 'Texture', optionChoisie: 'Flou', options: ['Flou', 'Ombre', 'Surbrillance', 'Tache', 'Tremblant']}
    ]
  },
  {
    nom: 'Rectangle',
    estActif: false,
    ID: 2,
    parametres: [
      {type: 'number', nom: 'Épaisseur du contour', valeur: 5},
      {type: 'select', nom: 'Type de tracé', optionChoisie: 'Contour', options: ['Contour', 'Plein', 'Plein avec contour']}
    ]
  },
  {
    nom: 'Ligne',
    estActif: false,
    ID: 3,
    parametres: [
      {type: 'number', nom: 'Épaisseur', valeur: 5},
      {type: 'select', nom: 'Type de jonction', optionChoisie: 'Avec points', options: ['Avec points', 'Sans points']},
      {type: 'number', nom: 'Diamètre des jonctions', valeur: 5}
    ]
  },
];
