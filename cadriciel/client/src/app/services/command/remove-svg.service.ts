import { Injectable } from '@angular/core';
import { DrawElement } from '../stockage-svg/draw-element';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { Command } from './command';

@Injectable({
  providedIn: 'root'
})
export class RemoveSVGService implements Command {
  constructor(public element: DrawElement,
              public svgStockage: SVGStockageService) {
    svgStockage.removeSVG(this.element);
  }

  undo(): void {
    this.svgStockage.addSVG(this.element);
  }

  redo(): void {
    this.svgStockage.removeSVG(this.element);
  }
}
