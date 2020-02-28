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
    console.log('undo before', this.SVGStockage);
    const element = this.SVGStockage.removeSVG(this.SVGKey);
    if (element) {
      this.element = element;
    }
    console.log('undo after', this.SVGStockage);
  }

  redo(): void {
    console.log('redo before', this.SVGStockage);
    if (this.element) {
      this.SVGStockage.addSVG(this.element, this.SVGKey);
    }
    console.log('redo after', this.SVGStockage);
  }
}
