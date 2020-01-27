import { Component, OnInit} from '@angular/core';
import { GuideSujet } from '../guide-sujet/guide-sujet.component';
import { ContenuGuide } from "./SujetsGuide";

@Component({
  selector: 'app-page-guide',
  templateUrl: './page-guide.component.html',
  styleUrls: ['./page-guide.component.scss']
})

export class PageGuideComponent implements OnInit {
  sujets: GuideSujet[] = ContenuGuide;
  sujetActif: GuideSujet;

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
        let tampon: GuideSujet = this.parcourirSujets(idRecherche, sujets[i].sousSujets!);
        if (tampon != sujetVide) {
          return tampon;
        }
      }
    }
    return sujetVide;
  }

  ouvrirCategories(categorie: GuideSujet[]) {
    categorie.forEach(element => {
      if (element.sousSujets) {
        element.categorieOuverte = true;
        this.ouvrirCategories(element.sousSujets!);
      }
    });
  };

  onClick(sensParcousID: number) {
    this.ouvrirCategories(this.sujets);
    
    //L'ID est optionnel, on vérifie que le sujet actif en a bien un
    if (this.sujetActif.id) {
  
      //Si on a cliqué sur "précédant", sensParcoursID = -1
      //Si on a cliqué sur "suivant", sensParcousID = 1
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