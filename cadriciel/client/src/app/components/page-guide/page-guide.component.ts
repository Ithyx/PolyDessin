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
  sujetTampon: GuideSujet;

  constructor() { }

  ngOnInit() {
  }

  parcourirSujets(idRecherche: number, sujets: GuideSujet[]): GuideSujet {
    for (let i = 0; i < sujets.length; i++) {
      
      //Première vérification
      if (idRecherche == sujets[i].id) {
        return sujets[i];
      }

      //Si sujets[i] possède des sousSujets, on veut les vérifiés aussi
      if (sujets[i].sousSujets) {
        this.sujetTampon = sujets[i];   
        if (this.sujetTampon.sousSujets) {  //TODO: Corriger la répétition de la même condition
          let tampon: GuideSujet = this.parcourirSujets(idRecherche, this.sujetTampon.sousSujets);
          if (tampon != sujetVide) {
            return tampon;
          }
        }
      }
    }
    return sujetVide;
  }

  onClick(sensParcousID: number) {
    //L'ID est optionnel, on vérifie que le sujet actif en a bien un
    if (this.sujetActif.id) {
  
      //Si on a cliqué sur "précédant", number = -1
      //Si on a cliqué sur "suivant", number = 1
      let nouvelID: number = this.sujetActif.id + sensParcousID;

      //On cherche dans notre liste pour voir si on trouve un sujet avec le nouvel ID
      this.sujetActif = this.parcourirSujets(nouvelID, this.sujets)
    }
  }

  onNotify(sujet: GuideSujet) {
    this.sujetActif = sujet;
  }
}

export const sujetVide: GuideSujet = { 
  nom: "",
  description: "",
  precedant: false,
  suivant: false,
  id: 0
}