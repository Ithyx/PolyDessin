import { Injectable } from '@angular/core';
import { StockageSvgService } from '../stockage-svg.service';
import { GestionnaireOutilsService } from './gestionnaire-outils.service';
import { InterfaceOutils } from './interface-outils';

@Injectable({
  providedIn: 'root'
})

export class DessinCrayonService implements InterfaceOutils {

  constructor(public stockageSVG: StockageSvgService, public outils: GestionnaireOutilsService) { }

  traitEnCours = false;
  click = true;

  sourisDeplacee(souris: MouseEvent) {
    if (this.traitEnCours) {
      let crayon: string = this.stockageSVG.getSVGEnCours();

      crayon += 'L' + souris.offsetX + ' ' + souris.offsetY + ' "/>';
      this.stockageSVG.setSVGEnCours(crayon);
    }
  }

  sourisEnfoncee(souris: MouseEvent) {
    this.traitEnCours = true;
    this.stockageSVG.setSVGEnCours(
      '<path fill="transparent" stroke="black" stroke-linecap="round" stroke-width="' + this.outils.outilActif.parametres[0].valeur
      + '" d="M' + souris.offsetX + ' ' + souris.offsetY + '"/>');
  }

  sourisRelachee(souris: MouseEvent) {
    if (this.traitEnCours) {
      const SVG: string = this.stockageSVG.getSVGEnCours();
      if (SVG.includes('L')) {
          // on ne stocke le path que s'il n'y a au moins une ligne
        this.stockageSVG.ajouterSVG(this.stockageSVG.getSVGEnCours() + '" />');
        this.stockageSVG.setSVGEnCours('');
      }
      this.traitEnCours = false;
    }
  }

  sourisCliquee(souris: MouseEvent) {
    if (this.click) {
      if (this.outils.outilActif.parametres[0].valeur) {
        const SVG = '<circle cx="' + souris.offsetX + '" cy="' + souris.offsetY + '" r="'
        + this.outils.outilActif.parametres[0].valeur / 2 + '" fill="black"/>';
        this.stockageSVG.ajouterSVG(SVG);
      }
      this.traitEnCours = false;
    } else {this.click = true};
  }

  sourisSortie(souris: MouseEvent) {
    console.log('La souris quitte la page dessin');
    if (this.traitEnCours) {
      this.stockageSVG.ajouterSVG(this.stockageSVG.getSVGEnCours() + '"/>');
      this.stockageSVG.setSVGEnCours('');
      this.traitEnCours = false;
    }
    this.click = false;
  }
}
