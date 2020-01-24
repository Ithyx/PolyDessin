import { Component, OnInit} from '@angular/core';
import { GuideSujet, ContenuGuide } from '../guide-sujet/guide-sujet.component';

@Component({
  selector: 'app-page-guide',
  templateUrl: './page-guide.component.html',
  styleUrls: ['./page-guide.component.scss']
})

export class PageGuideComponent implements OnInit {
  sujets: GuideSujet[] = ContenuGuide;
  sujetActif: GuideSujet;

  newID: number;
  sujetTampon: GuideSujet;
  
  constructor() { }

  ngOnInit() {
  }

  
  onClick(number: number) {
    //L'ID est optionnel, on vérifie que le sujet actif en a bien un
    if (this.sujetActif.id) {
  
      //Si on a cliqué sur "précédant", number = -1
      //Si on a cliqué sur "suivant", number = 1
      this.newID = this.sujetActif.id + number;

      //On cherche dans notre liste pour voir si on trouve un sujet avec le nouvel ID
      for (let i = 0; i < this.sujets.length; i++) {
        if (this.sujets[i].id == this.newID) {
          this.sujetActif = this.sujets[i];
          return;
        }
        //Recherche dans this.sujets[i].sousSujets
        if (this.sujets[i].sousSujets) {
          this.sujetTampon = this.sujets[i];

          if (this.sujetTampon.sousSujets) {
            for (let j = 0; j < this.sujetTampon.sousSujets.length; j++) {
              if (this.sujetTampon.sousSujets[j].id == this.newID) {
                this.sujetActif = this.sujetTampon.sousSujets[j];
                return;
              }
            }
          }
        }
      }
    }
  }

  onNotify(sujet: GuideSujet) {
    this.sujetActif = sujet;
  }

}
