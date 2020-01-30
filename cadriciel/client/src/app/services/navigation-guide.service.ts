import { Injectable } from '@angular/core';
import { GuideSujet } from '../components/guide-sujet/guide-sujet';

@Injectable({
  providedIn: 'root'
})

export class NavigationGuideService {

  parcourirSujets(idRecherche: number, sujets: GuideSujet[]): GuideSujet {
    for (const element of sujets) {
      // Première vérification
      if (idRecherche === element.id) {
        return element;
      }

      // Si element possède des sousSujets, on veut les vérifiés aussi
      if (element.sousSujets) {
        const tampon: GuideSujet = this.parcourirSujets(idRecherche, element.sousSujets);
        if (tampon !== SUJET_VIDE) {
          return tampon;
        }
      }
    }
    return SUJET_VIDE;
  }

  ouvrirCategories(categorie: GuideSujet[]) {
    categorie.forEach((element) => {
      if (element.sousSujets) {
        element.categorieOuverte = true;
        this.ouvrirCategories(element.sousSujets);
      }
    });
  };
}

export const SUJET_VIDE: GuideSujet = {
  nom: '',
  description: '',
  precedant: false,
  suivant: false,
  id: 0
}
