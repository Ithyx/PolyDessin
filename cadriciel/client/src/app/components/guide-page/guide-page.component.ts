import { Component } from '@angular/core';
import { RoutingManagerService } from 'src/app/services/routing-manager.service';
import { NavigationGuideService } from '../../services/navigation-guide.service';
import { SubjectGuide } from '../guide-subject/subject-guide';
import { GUIDE_CONTENTS } from './guide-contents';

@Component({
  selector: 'app-guide-page',
  templateUrl: './guide-page.component.html',
  styleUrls: ['./guide-page.component.scss']
})

export class GuidePageComponent {
  private subjects: SubjectGuide[] = GUIDE_CONTENTS;
  private activeSubject: SubjectGuide = GUIDE_CONTENTS[0];

  constructor(private navigationGuide: NavigationGuideService,
              protected routingManager: RoutingManagerService) { }

  onClick(changedID: number): void {
    this.navigationGuide.openCategories(this.subjects);

    // L'ID est optionnel, on vérifie que le sujet actif en a bien un
    if (this.activeSubject.id) {
      // Si on a cliqué sur "précédant", changedID = -1
      // Si on a cliqué sur "suivant", changedID = 1
      const newID: number = this.activeSubject.id + changedID;
      // On cherche dans notre liste pour voir si on trouve un sujet avec le nouvel ID
      this.activeSubject = this.navigationGuide.browseSubjects(newID, this.subjects);
    }
  }

  notificationReceived(subject: SubjectGuide): void {
    this.activeSubject = subject;
  }
}
