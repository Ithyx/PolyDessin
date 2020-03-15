import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Point } from '../tools/line-tool.service';
import { Command } from './command';
import { SelectionService } from '../tools/selection/selection.service';
import { DrawElement } from '../stockage-svg/draw-element';

@Injectable({
  providedIn: 'root'
})
export class TranslateSvgService implements Command {

  translation: Point;
  commandElements: DrawElement[];

  constructor( public selection: SelectionService,
               private sanitizer: DomSanitizer
             ) {
               this.translation = {x: this.selection.selectedElements[0].translate.x, y: this.selection.selectedElements[0].translate.y};
               this.commandElements = [...this.selection.selectedElements];
               console.log(this.translation);
               console.log(this.selection.selectedElements);
               console.log(this.commandElements);
               for (const element of this.selection.selectedElements) {
                element.svgHtml = this.sanitizer.bypassSecurityTrustHtml(element.svg);
                element.translateAllPoints();
              }
             }

  undo(): void {
    const newTranslation: Point = {x: - this.translation.x, y: -this.translation.y};
    this.applyTranslation(newTranslation);
    this.selection.deleteBoundingBox();
  }

  redo(): void {
    this.applyTranslation(this.translation);
    this.selection.deleteBoundingBox();
  }

  applyTranslation(translation: Point): void {
    for (const element of this.commandElements) {
      element.updatePosition(translation.x, translation.y);
      element.svgHtml = this.sanitizer.bypassSecurityTrustHtml(element.svg);
      element.translateAllPoints();
    }
  }

}
