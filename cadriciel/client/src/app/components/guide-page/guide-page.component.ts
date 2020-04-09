import { Component} from '@angular/core';
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

  private subjects: SubjectGuide[];
  private activeSubject: SubjectGuide;

  constructor(private navigationGuide: NavigationGuideService,
              protected routingManager: RoutingManagerService
             ) {
               this.subjects = GUIDE_CONTENTS;
               this.activeSubject = GUIDE_CONTENTS[0];
              }

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

  leaveGuide(): void {
    this.navigationGuide.closeCategories(this.subjects);
  }

  notificationReceived(subject: SubjectGuide): void {
    this.activeSubject = subject;
  }

}
