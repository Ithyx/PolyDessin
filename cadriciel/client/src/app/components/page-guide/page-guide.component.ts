import { Component } from '@angular/core';
import { RoutingManagerService } from 'src/app/services/routing-manager.service';
import { NavigationGuideService } from '../../services/navigation-guide.service';
import { SubjectGuide } from '../guide-sujet/guide-sujet';
import { CONTENU_GUIDE } from './SujetsGuide';

@Component({
  selector: 'app-page-guide',
  templateUrl: './page-guide.component.html',
  styleUrls: ['./page-guide.component.scss']
})

export class PageGuideComponent {
  sujets: SubjectGuide[] = CONTENU_GUIDE;
  sujetActif: SubjectGuide = CONTENU_GUIDE[0];

  constructor(private navigateurSujet: NavigationGuideService,
              public routingManager: RoutingManagerService) { }

  clic(sensParcousID: number) {
    this.navigateurSujet.openCategories(this.sujets);

    // L'ID est optionnel, on vérifie que le sujet actif en a bien un
    if (this.sujetActif.id) {
      // Si on a cliqué sur "précédant", sensParcoursID = -1
      // Si on a cliqué sur "suivant", sensParcousID = 1
      const nouvelID: number = this.sujetActif.id + sensParcousID;
      // On cherche dans notre liste pour voir si on trouve un sujet avec le nouvel ID
      this.sujetActif = this.navigateurSujet.browseSubjects(nouvelID, this.sujets);
    }
  }

  notificationRecu(sujet: SubjectGuide) {
    this.sujetActif = sujet;
  }
}
