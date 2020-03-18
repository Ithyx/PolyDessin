import { Injectable } from '@angular/core';
import { DrawElement } from '../stockage-svg/draw-element';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { Command } from './command';

@Injectable({
  providedIn: 'root'
})
export class RemoveSVGService implements Command {
  elements: DrawElement[];
  constructor(public svgStockage: SVGStockageService) {
    this.elements = [];
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

  addElements(elements: DrawElement[]): void {
    for (const element of elements) {
      this.svgStockage.removeSVG(element);
      this.elements.push(element);
    }
  }

  isEmpty(): boolean {
    return this.elements.length === 0;
  }
}
