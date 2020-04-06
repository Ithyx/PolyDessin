import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DrawElement, Point } from '../stockage-svg/draw-element/draw-element';
import { SelectionBoxService } from '../tools/selection/selection-box.service';
import { Command } from './command';

@Injectable({
  providedIn: 'root'
})
export class TranslateSvgService implements Command {

  private translation: Point;
  private commandElements: DrawElement[];

  constructor( private selectedElements: DrawElement[],
               private selectionBox: SelectionBoxService,
               private sanitizer: DomSanitizer,
               private deleteBoundingBoxMethod: () => void
             ) {
                // this.translation = {x: this.selectedElements[0].translate.x, y: this.selectedElements[0].translate.y};
               this.commandElements = [...this.selectedElements];
               for (const element of this.selectedElements) {
                element.svgHtml = this.sanitizer.bypassSecurityTrustHtml(element.svg);
                element.translateAllPoints();
               }
               for (const element of this.selectionBox.controlPointBox) {
                 element.translateAllPoints();
               }
             }

  undo(): void {
    const newTranslation: Point = {x: - this.translation.x, y: -this.translation.y};
    this.applyTranslation(newTranslation);
    this.deleteBoundingBoxMethod();
  }

  redo(): void {
    this.applyTranslation(this.translation);
    this.deleteBoundingBoxMethod();
  }

  applyTranslation(translation: Point): void {
    for (const element of this.commandElements) {
      element.updateTranslation(translation.x, translation.y);
      element.svgHtml = this.sanitizer.bypassSecurityTrustHtml(element.svg);
    }
  }

}
