import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GestionnaireCommandesService } from './commande/gestionnaire-commandes.service';
import { DessinLigneService } from './outils/dessin-ligne.service';
import { DessinRectangleService } from './outils/dessin-rectangle.service';
import { GestionnaireOutilsService, INDEX_OUTIL_CRAYON,
         INDEX_OUTIL_LIGNE, INDEX_OUTIL_PINCEAU , INDEX_OUTIL_RECTANGLE, INDEX_OUTIL_SELECTION } from './outils/gestionnaire-outils.service';

@Injectable({
  providedIn: 'root'
})
export class GestionnaireRaccourcisService {
  champDeTexteEstFocus = false;

  emitterNouveauDessin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(public outils: GestionnaireOutilsService,
              public dessinRectangle: DessinRectangleService,
              public dessinLigne: DessinLigneService,
              public commandes: GestionnaireCommandesService) { }

  viderSVGEnCours() {
    this.dessinRectangle.vider();
    this.dessinLigne.vider();
  }

  traiterInput(clavier: KeyboardEvent) {
    if (this.champDeTexteEstFocus) { return; };
    switch (clavier.key) {
      case '1':
        this.outils.changerOutilActif(INDEX_OUTIL_RECTANGLE);
        this.viderSVGEnCours();
        break;

      case 'c':
        this.outils.changerOutilActif(INDEX_OUTIL_CRAYON);
        this.viderSVGEnCours();
        break;

      case 'l':
        this.outils.changerOutilActif(INDEX_OUTIL_LIGNE);
        this.viderSVGEnCours();
        break;

      case 'w':
        this.outils.changerOutilActif(INDEX_OUTIL_PINCEAU);
        this.viderSVGEnCours();
        break;

      case 's':
        this.outils.changerOutilActif(INDEX_OUTIL_SELECTION);
        this.viderSVGEnCours();

      case 'z':
        if (clavier.ctrlKey && !this.commandes.dessinEnCours) {
          this.commandes.annulerCommande();
        }
        break;

      case 'Z':
        if (clavier.ctrlKey && !this.commandes.dessinEnCours) {
          this.commandes.refaireCommande();
        }
        break;

      case 'Shift':
        if (this.outils.outilActif.ID === INDEX_OUTIL_RECTANGLE) {
          this.dessinRectangle.shiftEnfonce();
        }
        if (this.outils.outilActif.ID === INDEX_OUTIL_LIGNE) {
          this.dessinLigne.stockerCurseur();
        }
        break;

      case 'o':
        if (clavier.ctrlKey) {
          this.emitterNouveauDessin.next(false);
          clavier.preventDefault();
        }
        break;

      case 'Backspace':
        if (this.outils.outilActif.ID === INDEX_OUTIL_LIGNE) {
          this.dessinLigne.retirerPoint();
        }
        break;

      case 'Escape':
        if (this.outils.outilActif.ID === INDEX_OUTIL_LIGNE) {
          this.dessinLigne.vider();
        }
        break;

      default:
        break;
    }
  }

  traiterToucheRelachee(clavier: KeyboardEvent) {
    switch (clavier.key) {
      case 'Shift':
        if (this.outils.outilActif.ID === INDEX_OUTIL_RECTANGLE) {
          this.dessinRectangle.shiftRelache();
        }
        if (this.outils.outilActif.ID === INDEX_OUTIL_LIGNE) {
          this.dessinLigne.shiftRelache();
        }
        break;

      default:
        break;
    }
  }
}
