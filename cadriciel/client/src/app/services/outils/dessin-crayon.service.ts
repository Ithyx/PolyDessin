import { Injectable } from '@angular/core';
import { StockageSvgService } from '../stockage-svg.service';
import { GestionnaireOutilsService } from './gestionnaire-outils.service';

@Injectable({
  providedIn: 'root'
})

export class DessinCrayonService {

  constructor(public stockageSVG: StockageSvgService, public outils: GestionnaireOutilsService) { }

  onClickCrayon(click: MouseEvent) {
    if (this.outils.outilActif.parametres[0].valeur) {
      const SVG = '<circle cx="' + click.offsetX + '" cy="' + click.offsetY + '" r="' + this.outils.outilActif.parametres[0].valeur / 2
      + '" fill="black"/>';
      this.stockageSVG.ajouterSVG(SVG);
    }
  }

  onMouseMoveCrayon(mouse: MouseEvent) {
    let crayon: string = this.stockageSVG.getSVGEnCours();

    crayon += 'L' + mouse.offsetX + ' ' + mouse.offsetY + ' "/>';
    this.stockageSVG.setSVGEnCours(crayon);
  }

  onMousePressCrayon(mouse: MouseEvent) {
    this.stockageSVG.setSVGEnCours(
      '<path fill="transparent" stroke="black" stroke-linecap="round" stroke-width="' + this.outils.outilActif.parametres[0].valeur
      + '" d="M' + mouse.offsetX + ' ' + mouse.offsetY + '"/>');
  }

  onMouseReleaseCrayon(mouse: MouseEvent) {
    const SVG: string = this.stockageSVG.getSVGEnCours();
    if (SVG.includes('L')) {
      /* on ne stocke le path que s'il n'y a au moins une ligne */
      this.stockageSVG.ajouterSVG(this.stockageSVG.getSVGEnCours() + '" />');
      this.stockageSVG.setSVGEnCours('');
    }
  }

  onMouseLeaveCrayon(mouse: MouseEvent) {
    this.stockageSVG.ajouterSVG(this.stockageSVG.getSVGEnCours() + '"/>');
    this.stockageSVG.setSVGEnCours('');
  }

}
