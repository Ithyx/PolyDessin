import { Injectable } from '@angular/core';
import { DessinLigneService } from './outils/dessin-ligne.service';
import { DessinRectangleService } from './outils/dessin-rectangle.service';
import { GestionnaireOutilsService, INDEX_OUTIL_CRAYON,
         INDEX_OUTIL_LIGNE, INDEX_OUTIL_PINCEAU , INDEX_OUTIL_RECTANGLE } from './outils/gestionnaire-outils.service';

@Injectable({
  providedIn: 'root'
})
export class GestionnaireRaccourcisService {
  champDeTexteEstFocus = false;

  constructor(public outils: GestionnaireOutilsService,
              public dessinRectangle: DessinRectangleService,
              public dessinLigne: DessinLigneService) { }

  traiterInput(clavier: KeyboardEvent) {
    if (this.champDeTexteEstFocus) { return; };
    // ? peut-être mettre tout en minuscule ?
    switch (clavier.key) {

      case '1':
        this.outils.changerOutilActif(INDEX_OUTIL_RECTANGLE);
        break;

      case 'c':
        this.outils.changerOutilActif(INDEX_OUTIL_CRAYON);
        break;

      case 'l':
        this.outils.changerOutilActif(INDEX_OUTIL_LIGNE);
        break;

      case 'w':
        this.outils.changerOutilActif(INDEX_OUTIL_PINCEAU);
        break;

      case 'Shift':
        if (this.outils.outilActif.ID === INDEX_OUTIL_RECTANGLE) {
          this.dessinRectangle.shiftEnfonce();
        } else if (this.outils.outilActif.ID === INDEX_OUTIL_LIGNE) {
          this.dessinLigne.stockerCurseur();
        }
        break;

      case 'Backspace':
        if (this.outils.outilActif.ID === INDEX_OUTIL_LIGNE) {
          this.dessinLigne.retirerPoint();
        }
        break;

      case 'Escape':
      if (this.outils.outilActif.ID === INDEX_OUTIL_LIGNE) {
        this.dessinLigne.annulerLigne();
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
          this.dessinRectangle.shiftRelache();
        } else if (this.outils.outilActif.ID === INDEX_OUTIL_LIGNE) {
          this.dessinLigne.shiftRelache();
        }
        break;

      default:
        break;
    }
  }
}
