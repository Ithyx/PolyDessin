import { Injectable } from '@angular/core';
import { DessinRectangleService } from './outils/dessin-rectangle.service';
import { GestionnaireOutilsService, INDEX_OUTIL_CRAYON,
         INDEX_OUTIL_LIGNE, INDEX_OUTIL_PINCEAU , INDEX_OUTIL_RECTANGLE } from './outils/gestionnaire-outils.service';

@Injectable({
  providedIn: 'root'
})
export class GestionnaireRaccourcisService {
  champDeTexteEstFocus = false;

  constructor(public outils: GestionnaireOutilsService, public dessinRectangle: DessinRectangleService) { }

  traiterInput(clavier: KeyboardEvent) {
    if (this.champDeTexteEstFocus) { return; };
    // ? peut-être mettre tout en minuscule ?
    switch (clavier.key) {

      case '1':
        this.outils.outilActif.estActif = false;
        this.outils.outilActif = this.outils.listeOutils[INDEX_OUTIL_RECTANGLE];
        this.outils.outilActif.estActif = true;
        break;

      case 'c':
        this.outils.outilActif.estActif = false;
        this.outils.outilActif = this.outils.listeOutils[INDEX_OUTIL_CRAYON];
        this.outils.outilActif.estActif = true;
        break;

      case 'l':
        this.outils.outilActif.estActif = false;
        this.outils.outilActif = this.outils.listeOutils[INDEX_OUTIL_LIGNE];
        this.outils.outilActif.estActif = true;
        break;

      case 'w':
        this.outils.outilActif.estActif = false;
        this.outils.outilActif = this.outils.listeOutils[INDEX_OUTIL_PINCEAU];
        this.outils.outilActif.estActif = true;
        break;

      case 'Shift':
        if (this.outils.outilActif.ID === INDEX_OUTIL_RECTANGLE) {
          this.dessinRectangle.onShiftPressedRectangle();
        }
        break;

      default:
        break;
    }
  }

  traiterToucheRelachee(clavier: KeyboardEvent) {
    console.log('event reçu, touche relâchée :', clavier.key);
    switch (clavier.key) {
      case 'Shift':
        if (this.outils.outilActif.ID === INDEX_OUTIL_RECTANGLE) {
          this.dessinRectangle.onShiftReleasedRectangle();
        }
        break;

      default:
        break;
    }
  }
}
