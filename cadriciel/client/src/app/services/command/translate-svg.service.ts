import { Injectable } from '@angular/core';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { Point } from '../tools/line-tool.service';
import { Command } from './command';

@Injectable({
  providedIn: 'root'
})
export class TranslateSvgService implements Command {

  constructor( public oldTranslation: Point,
               public SVGKey: number,
               public stockageSVG: SVGStockageService
     ) {
    this.oldTranslation = {x: 0 , y: 0};
  }

  undo(): void {
    // TODO
  }

  redo(): void {
    // TODO
  }

}
