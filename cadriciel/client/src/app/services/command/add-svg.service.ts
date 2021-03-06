import { Injectable } from '@angular/core';
import { SVGStockageService } from 'src/app/services/stockage-svg/svg-stockage.service';
import { DrawElement } from '../stockage-svg/draw-element/draw-element';
import { Command } from './command';

@Injectable({
  providedIn: 'root'
})
export class AddSVGService implements Command {
  constructor(private elements: DrawElement[],
              private svgStockage: SVGStockageService) {
    for (const element of elements) {
      this.svgStockage.addSVG(element);
    }
  }

  undo(): void {
    for (const element of this.elements) {
      this.svgStockage.removeSVG(element);
    }
  }

  redo(): void {
    for (const element of this.elements) {
      this.svgStockage.addSVG(element);
    }
  }
}
