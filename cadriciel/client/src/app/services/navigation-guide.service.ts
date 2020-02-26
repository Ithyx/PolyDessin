import { Injectable } from '@angular/core';
import { GuideSujet } from '../components/guide-sujet/guide-sujet';

@Injectable({
  providedIn: 'root'
})

export class NavigationGuideService {

  browseSubjects(subjectID: number, subjects: GuideSujet[]): GuideSujet {
    for (const element of subjects) {
      // Première vérification
      if (subjectID === element.id) {
        return element;
      }

      // Si element possède des sousSujets, on veut les vérifiés aussi
      if (element.sousSujets) {
        const buffer: GuideSujet = this.browseSubjects(subjectID, element.sousSujets);
        if (buffer !== EMPTY_SUBJECT) {
          return buffer;
        }
      }
    }
    return EMPTY_SUBJECT;
  }

  openCategories(category: GuideSujet[]) {
    category.forEach((element) => {
      if (element.sousSujets) {
        element.categorieOuverte = true;
        this.openCategories(element.sousSujets);
      }
    });
  };
}

export const EMPTY_SUBJECT: GuideSujet = {
  nom: '',
  description: '',
  precedant: false,
  suivant: false,
  id: 0
}
