import { Injectable } from '@angular/core';
import { ParametresCouleurService } from './parametres-couleur.service'

export enum Portee {
  Principale = 1,
  Secondaire,
  Fond,
  Defaut,
}

export const MAX_COULEURS = 10;

@Injectable({
  providedIn: 'root'
})
export class GestionnaireCouleursService {
  couleur = 'rgba(0, 0, 0,';
  teinte: string;
  RGB: number[] = [0, 0, 0];

  constructor(public parametresCouleur: ParametresCouleurService) {}

  getCouleur() {
    return this.couleur + '1)';
  }

  modifierRGB() {
    const nouvelleCouleur = 'rgba(' + this.RGB[0] + ', '
                                    + this.RGB[1] + ', '
                                    + this.RGB[2] + ', ';
    this.couleur = nouvelleCouleur;
  }

  appliquerCouleur(portee: Portee) {
    switch (portee) {
      case Portee.Principale:
        console.log('nouvelle couleur principale: ', this.couleur + this.parametresCouleur.opacitePrincipale + ')');
        this.parametresCouleur.couleurPrincipale = this.couleur;
        this.ajouterDerniereCouleur();
        break;
      case Portee.Secondaire:
        console.log('nouvelle couleur secondaire: ', this.couleur + this.parametresCouleur.opaciteSecondaire + ')');
        this.parametresCouleur.couleurSecondaire = this.couleur;
        this.ajouterDerniereCouleur();
        break;
      case Portee.Fond:
        console.log('nouvelle couleur fond: ', this.couleur + '1)');
        this.parametresCouleur.couleurFond = this.couleur + '1)';
      default:
        /* Par mesure de sécurité, ne rien faire. */
        break;
    }
  }

  ajouterDerniereCouleur() {
    while (this.parametresCouleur.dernieresCouleurs.length >= MAX_COULEURS) {
      this.parametresCouleur.dernieresCouleurs.shift();
    }
    this.parametresCouleur.dernieresCouleurs.push(this.couleur);
  }

  /*
  RGBVersHSL(RGB: [number, number, number]): [number, number, number] {
    const RGBNormalise = RGB.map((element: number) => element / 255);
    const max = Math.max(...RGBNormalise);
    const min = Math.min(...RGBNormalise);
    const indexDuMax = RGBNormalise.indexOf(max);
    const luminosite = (max + min) / 2;

    let saturation = 0;
    if (max !== min) {
      if (luminosite < 0.5) {
        saturation = (max - min) / (max + min);
      } else {
        saturation = (max - min) / (2.0 - max - min);
      };
    }
    let teinte = 0;
    switch (indexDuMax) {
      case 0:
        teinte = (RGBNormalise[1] - RGBNormalise[2]) / (max - min);
        break;
      case 1:
        teinte = 2.0 + (RGBNormalise[2] - RGBNormalise[0]) / (max - min);
        break;
      case 2:
        teinte = 4.0 + (RGBNormalise[0] - RGBNormalise[1]) / (max - min);
        break;
      default:
        break;
    }

    teinte = (teinte * 60 + 360) % 360;

    return [teinte, saturation, luminosite];
  }
  */
}
