import { Injectable } from '@angular/core';
import { GestionnaireOutilsService, INDEX_OUTIL_CRAYON } from './outils/gestionnaire-outils.service';

@Injectable({
  providedIn: 'root'
})
export class GestionnaireRaccourcisService {

  constructor(public outils: GestionnaireOutilsService) { }

  traiterInput(clavier: KeyboardEvent) {
    // ? peut-être mettre tout en minuscule ?
    console.log('event reçu, touche enfoncée :', clavier.key);
    switch (clavier.key) {
      case 'c':
        this.outils.outilActif.estActif = false;
        this.outils.outilActif = this.outils.listeOutils[INDEX_OUTIL_CRAYON];
        this.outils.outilActif.estActif = true;
        break;
    
      default:
        break;
    }
  }
}
