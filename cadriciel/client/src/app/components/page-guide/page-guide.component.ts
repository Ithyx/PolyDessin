import { Component, OnInit} from '@angular/core';
import { NavigationGuideService } from '../../services/navigation-guide.service';
import { GuideSujet } from '../guide-sujet/guide-sujet.component';
import { ContenuGuide } from './SujetsGuide';

@Component({
  selector: 'app-page-guide',
  templateUrl: './page-guide.component.html',
  styleUrls: ['./page-guide.component.scss']
})

export class PageGuideComponent implements OnInit {
  sujets: GuideSujet[] = ContenuGuide;
  sujetActif: GuideSujet;

  navigateurSujet: NavigationGuideService;
  constructor() { }

  ngOnInit() {}

  onClick(sensParcousID: number) {
    this.navigateurSujet.ouvrirCategories(this.sujets);

    // L'ID est optionnel, on vérifie que le sujet actif en a bien un
    if (this.sujetActif.id) { 
      //Si on a cliqué sur "précédant", sensParcoursID = -1
      //Si on a cliqué sur "suivant", sensParcousID = 1
      let nouvelID: number = this.sujetActif.id + sensParcousID;

      //On cherche dans notre liste pour voir si on trouve un sujet avec le nouvel ID
      this.sujetActif = this.navigateurSujet.parcourirSujets(nouvelID, this.sujets);
    }
  }

  onNotify(sujet: GuideSujet) {
    this.sujetActif = sujet;
  }
}

/*export const sujetVide: GuideSujet = { 
  nom: "",
  description: "",
  precedant: false,
  suivant: false,
  id: 0
}*/