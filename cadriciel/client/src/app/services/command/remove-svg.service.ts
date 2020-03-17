import { Injectable } from '@angular/core';
import { DrawElement } from '../stockage-svg/draw-element';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { Command } from './command';

@Injectable({
  providedIn: 'root'
})
export class RemoveSVGService implements Command {
  constructor(public elements: DrawElement[],
              public svgStockage: SVGStockageService) {
    for (const element of elements) {
      svgStockage.removeSVG(element);
    }
  }

  undo(): void {
    for (const element of this.elements) {
      this.svgStockage.addSVG(element);
    }
  }

  redo(): void {
    for (const element of this.elements) {
      this.svgStockage.removeSVG(element);
    }
  }
}
