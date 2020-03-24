import { Injectable } from '@angular/core';
import { SubjectGuide } from '../components/guide-subject/subject-guide';

@Injectable({
  providedIn: 'root'
})

export class NavigationGuideService {

  browseSubjects(subjectID: number, subjects: SubjectGuide[]): SubjectGuide {
    for (const element of subjects) {
      // Première vérification
      if (subjectID === element.id) {
        return element;
      }

      // Si element possède des subSubjects, on veut les vérifiés aussi
      if (element.subSubjects) {
        const buffer: SubjectGuide = this.browseSubjects(subjectID, element.subSubjects);
        if (buffer !== EMPTY_SUBJECT) {
          return buffer;
        }
      }
    }
    return EMPTY_SUBJECT;
  }

  openCategories(category: SubjectGuide[]): void {
    category.forEach((element) => {
      if (element.subSubjects) {
        element.openCategory = true;
        this.openCategories(element.subSubjects);
      }
    });
  }

  closeCategories(category: SubjectGuide[]): void {
    category.forEach((element) => {
      if (element.subSubjects) {
        element.openCategory = false;
        this.closeCategories(element.subSubjects);
      }
    });
  }
}

export const EMPTY_SUBJECT: SubjectGuide = {
  name: '',
  description: '',
  previous: false,
  next: false,
  id: 0
};
