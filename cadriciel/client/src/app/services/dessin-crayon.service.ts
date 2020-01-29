import { Injectable } from '@angular/core';
import { StockageSvgService } from './stockage-svg.service';

@Injectable({
  providedIn: 'root'
})

export class DessinCrayonService {

  epaisseur: number;  // stroke-width="10"
  couleur: number;    // stroke="black"

  constructor(public stockageSVG: StockageSvgService) { }

  /*onClickCrayon(click: MouseEvent): StockageSvgService {
    const SVG = '<circle cx="' + click.offsetX + '" cy="' + click.offsetY + '" r="5" fill="red"/>';
    this.stockageSVG.ajouterSVG(SVG);

    return this.stockageSVG;
  }   utile? */

  onMouseMoveCrayon(mouse: MouseEvent): StockageSvgService {
    let crayon: string = this.stockageSVG.getSVGEnCours();

    crayon += 'L' + mouse.offsetX + ' ' + mouse.offsetY + ' "/>';
    this.stockageSVG.setSVGEnCours(crayon);

    return this.stockageSVG;
  }

  onMousePressCrayon(mouse: MouseEvent): StockageSvgService {
    this.stockageSVG.setSVGEnCours(
      '<path fill="transparent" stroke="black" stroke-width="1" d="M' + mouse.offsetX + ' ' + mouse.offsetY + '"/>');

    return this.stockageSVG;
  }

  onMouseReleaseCrayon(mouse: MouseEvent): StockageSvgService {
    this.stockageSVG.ajouterSVG(this.stockageSVG.getSVGEnCours() + '" />');
    this.stockageSVG.setSVGEnCours('');

    return this.stockageSVG;
  }

  onMouseLeaveCrayon(mouse: MouseEvent): StockageSvgService {
    this.stockageSVG.ajouterSVG(this.stockageSVG.getSVGEnCours() + '"/>');
    this.stockageSVG.setSVGEnCours('');

    return this.stockageSVG;
  }

}
