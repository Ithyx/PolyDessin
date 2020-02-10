import { Injectable } from '@angular/core';
import { ParametresCouleurService } from './parametres-couleur.service'

export enum Portee {
  Principale = 1,
  Secondaire,
  Defaut,
}

@Injectable({
  providedIn: 'root'
})
export class GestionnaireCouleursService {
  teinte: string;
  RGB: number[] = [0, 0, 0];
  alpha = 1;

  constructor(public parametresCouleur: ParametresCouleurService) {}

  modifierRGB(portee: Portee) {
    const nouvelleCouleur = 'rgba(' + this.RGB[0] + ', '
                                    + this.RGB[1] + ', '
                                    + this.RGB[2] + ', '
                                    + this.alpha + ')';
    this.setCouleur(portee, nouvelleCouleur);
  }

  setCouleur(portee: Portee, nouvelleCouleur: string) {
    console.log('Portée: ', portee);
    switch (portee) {
      case Portee.Principale:
        console.log('nouvelle couleur principale: ', nouvelleCouleur);
        this.parametresCouleur.couleurPrincipale = nouvelleCouleur;
        break;
      case Portee.Secondaire:
        console.log('nouvelle couleur secondaire: ', nouvelleCouleur);
        this.parametresCouleur.couleurSecondaire = nouvelleCouleur;
        break;
      default:
        /* Par mesure de sécurité, ne rien faire. */
        break;
    }
  }

  RBGVersHSL(RGB: [number, number, number]): [number, number, number] {
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

    return [teinte, saturation, luminosite];
  }
}
