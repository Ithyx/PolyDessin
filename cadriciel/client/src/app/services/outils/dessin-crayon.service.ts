import { Injectable } from '@angular/core';
import { GestionnaireCouleursService } from '../couleur/gestionnaire-couleurs.service';
import { StockageSvgService } from '../stockage-svg.service';
import { GestionnaireOutilsService } from './gestionnaire-outils.service';
import { InterfaceOutils } from './interface-outils';

@Injectable({
  providedIn: 'root'
})

export class DessinCrayonService implements InterfaceOutils {

  constructor(public stockageSVG: StockageSvgService,
              public outils: GestionnaireOutilsService,
              public couleur: GestionnaireCouleursService) { }

  sourisDeplacee(souris: MouseEvent) {
    let crayon: string = this.stockageSVG.getSVGEnCours();

    crayon += 'L' + souris.offsetX + ' ' + souris.offsetY + ' "/>';
    this.stockageSVG.setSVGEnCours(crayon);
  }

  sourisEnfoncee(souris: MouseEvent) {
    this.stockageSVG.setSVGEnCours(
      `<path fill="transparent" stroke="${this.couleur.getPrincipale()}" stroke-linecap="round" stroke-width="`
      + this.outils.outilActif.parametres[0].valeur
      + '" d="M' + souris.offsetX + ' ' + souris.offsetY + '"/>');
  }

  sourisRelachee(souris: MouseEvent) {
    const SVG: string = this.stockageSVG.getSVGEnCours();
    if (SVG.includes('L')) {
      /* on ne stocke le path que s'il n'y a au moins une ligne */
      this.stockageSVG.ajouterSVG(this.stockageSVG.getSVGEnCours() + '" />');
      this.stockageSVG.setSVGEnCours('');
    }
  }

  sourisCliquee(souris: MouseEvent) {
    if (this.outils.outilActif.parametres[0].valeur) {
      const SVG = '<circle cx="' + souris.offsetX + '" cy="' + souris.offsetY + '" r="'
      + this.outils.outilActif.parametres[0].valeur / 2 + `" fill="${this.couleur.getPrincipale()}"/>`;
      this.stockageSVG.ajouterSVG(SVG);
    }
  }

  sourisSortie(souris: MouseEvent) {
    this.stockageSVG.ajouterSVG(this.stockageSVG.getSVGEnCours() + '"/>');
    this.stockageSVG.setSVGEnCours('');
  }

}
