import { Injectable } from '@angular/core';
import { SVGStockageService } from 'src/app/services/stockage-svg/svg-stockage.service';
import { DrawElement } from '../stockage-svg/draw-element';
import { Command } from './command';

@Injectable({
  providedIn: 'root'
})
export class AddSVGService implements Command {
  SVGKey: number;
  constructor(public element: DrawElement,
              public SVGStockage: SVGStockageService) {
    this.SVGStockage.addSVG(this.element);
    this.SVGKey = this.SVGStockage.size;
  }

  undo(): void {
    const element = this.SVGStockage.removeSVG(this.SVGKey);
    if (element) {
      this.element = element;
    }
  }

  redo(): void {
    if (this.element) {
      this.SVGStockage.addSVG(this.element, this.SVGKey);
    }
  }
}
