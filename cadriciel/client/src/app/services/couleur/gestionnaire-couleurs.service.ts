import { Injectable } from '@angular/core';

export enum Portee {
  Principale = 0,
  Secondaire,
  Defaut,
}

@Injectable({
  providedIn: 'root'
})
export class GestionnaireCouleursService {
  couleurs: string[] = ['rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)'];
  portee: Portee = Portee.Principale;
  couleur: string;
  teinte: string;
  RGB: number[] = [0, 0, 0];
  alpha = 1;

  modifierRGB() {
    const nouvelleCouleur = 'rgba(' + this.RGB[0] + ', '
                                    + this.RGB[1] + ', '
                                    + this.RGB[2] + ', '
                                    + this.alpha + ')';
    this.couleur = nouvelleCouleur;
  }

  appliquerCouleur() {
    console.log('Couleur appliquée: ', this.couleur);
    this.couleurs[this.portee] = this.couleur;
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

    teinte = (teinte * 30 + 360) % 360;
    return [teinte, saturation, luminosite];
  }
}
