import { Injectable } from '@angular/core';
import { SVGStockageService } from 'src/app/services/stockage-svg/svg-stockage.service';
import { DrawElement } from '../stockage-svg/draw-element';
import { Command } from './command';

@Injectable({
  providedIn: 'root'
})
export class AddSVGService implements Command {
  constructor(private element: DrawElement,
              private svgStockage: SVGStockageService) {
    this.svgStockage.addSVG(this.element);
  }

  undo(): void {
    this.svgStockage.removeSVG(this.element);
  }

  redo(): void {
    this.svgStockage.addSVG(this.element);
  }
}
