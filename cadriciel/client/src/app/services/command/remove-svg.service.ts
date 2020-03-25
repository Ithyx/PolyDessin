import { Injectable } from '@angular/core';
import { DrawElement } from '../stockage-svg/draw-element';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { Command } from './command';

@Injectable({
  providedIn: 'root'
})
export class RemoveSVGService implements Command {
  private elementsKeys: number[];
  private elementsBeforeRemove: DrawElement[];
  constructor(private svgStockage: SVGStockageService) {
    this.elementsKeys = [];
    this.elementsBeforeRemove = [...svgStockage.getCompleteSVG()];
  }

  undo(): void {
    this.elementsKeys.sort();
    for (const key of this.elementsKeys) {
      this.svgStockage.addSVG(this.elementsBeforeRemove[key]);
    }
  }

  redo(): void {
    for (const key of this.elementsKeys) {
      this.svgStockage.removeSVG(this.elementsBeforeRemove[key]);
    }
  }

  addElements(elements: DrawElement[]): void {
    for (const element of elements) {
      this.svgStockage.removeSVG(element);
      const key = this.elementsBeforeRemove.indexOf(element);
      this.elementsKeys.push(key);
    }
  }

  isEmpty(): boolean {
    return this.elementsKeys.length === 0;
  }
}
