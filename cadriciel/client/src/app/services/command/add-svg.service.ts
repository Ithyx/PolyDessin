import { Injectable } from '@angular/core';
import { SVGStockageService } from 'src/app/services/stockage-svg/svg-stockage.service';
import { DrawElement } from '../stockage-svg/draw-element';
import { Command } from './command';

@Injectable({
  providedIn: 'root'
})
export class AddSVGService implements Command {
  svgKey: number;
  constructor(public element: DrawElement,
              public svgStockage: SVGStockageService) {
    this.svgStockage.addSVG(this.element);
    this.svgKey = this.svgStockage.size - 1;
  }

  undo(): void {
    const element = this.svgStockage.removeSVG(this.svgKey);
    if (element) {
      this.element = element;
    }
  }

  redo(): void {
    this.svgStockage.addSVG(this.element);
    this.svgKey = this.svgStockage.size - 1;
  }
}
