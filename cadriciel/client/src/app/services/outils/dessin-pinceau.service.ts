import { Injectable } from '@angular/core';
import { StockageSvgService } from '../stockage-svg.service';
import { GestionnaireOutilsService } from './gestionnaire-outils.service';

@Injectable({
  providedIn: 'root'
})
export class DessinPinceauService {

  constructor(public stockageSVG: StockageSvgService, public outils: GestionnaireOutilsService) { }

  onClickPinceau(click: MouseEvent) {
    if (this.outils.outilActif.parametres[0].valeur) {
      const SVG = '<circle filter="url(#' + this.outils.outilActif.parametres[1].optionChoisie
      + ')"  cx="' + click.offsetX + '" cy="' + click.offsetY + '" r="'
      + this.outils.outilActif.parametres[0].valeur / 2 + '" fill="black"/>';
      this.stockageSVG.ajouterSVG(SVG);
    }
  }

  onMouseMovePinceau(mouse: MouseEvent) {
    let crayon: string = this.stockageSVG.getSVGEnCours();

    crayon += 'L' + mouse.offsetX + ' ' + mouse.offsetY + ' "/>';
    this.stockageSVG.setSVGEnCours(crayon);
  }

  onMousePressPinceau(mouse: MouseEvent) {
    this.stockageSVG.setSVGEnCours(
      '<path filter="url(#' + this.outils.outilActif.parametres[1].optionChoisie
      + ')"  fill="transparent" stroke="black" stroke-linecap="round" stroke-width="'
      + this.outils.outilActif.parametres[0].valeur + '" d="M' + mouse.offsetX + ' ' + mouse.offsetY + '"/>');
  }

  onMouseReleasePinceau(mouse: MouseEvent) {
    const SVG: string = this.stockageSVG.getSVGEnCours();
    if (SVG.includes('L')) {
      /* on ne stocke le path que s'il n'y a au moins une ligne */
      this.stockageSVG.ajouterSVG(this.stockageSVG.getSVGEnCours() + '" />');
      this.stockageSVG.setSVGEnCours('');
    }
  }

  onMouseLeavePinceau(mouse: MouseEvent) {
    this.stockageSVG.ajouterSVG(this.stockageSVG.getSVGEnCours() + '"/>');
    this.stockageSVG.setSVGEnCours('');
  }
}