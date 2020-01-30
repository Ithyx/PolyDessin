import { Injectable } from '@angular/core';
import { StockageSvgService } from './stockage-svg.service';

@Injectable({
  providedIn: 'root'
})

export class DessinCrayonService {

  epaisseur: number;  // stroke-width="10"
  couleur: number;    // stroke="black"

  constructor(public stockageSVG: StockageSvgService) { }

  onClickCrayon(click: MouseEvent) {
    const SVG = '<circle cx="' + click.offsetX + '" cy="' + click.offsetY + '" r="10" fill="black"/>';
    this.stockageSVG.ajouterSVG(SVG);
  }

  onMouseMoveCrayon(mouse: MouseEvent) {
    let crayon: string = this.stockageSVG.getSVGEnCours();

    crayon += 'L' + mouse.offsetX + ' ' + mouse.offsetY + ' "/>';
    this.stockageSVG.setSVGEnCours(crayon);
  }

  onMousePressCrayon(mouse: MouseEvent) {
    this.stockageSVG.setSVGEnCours(
      '<path fill="transparent" stroke="black" stroke-linecap="round" stroke-width="20" d="M'
      + mouse.offsetX + ' ' + mouse.offsetY + '"/>');
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
