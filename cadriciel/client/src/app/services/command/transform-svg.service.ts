import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DrawElement, Point, TransformMatrix } from '../stockage-svg/draw-element/draw-element';
import { Command } from './command';

interface OldElementParameters {
  transform: TransformMatrix;
  strokePoints: Point[];
}

@Injectable({
  providedIn: 'root'
})
export class TransformSvgService implements Command {

  private elements: Map<DrawElement, OldElementParameters>;

  constructor(elements: DrawElement[],
              private sanitizer: DomSanitizer,
              private deleteBoundingBoxMethod: () => void) {
    this.elements = new Map<DrawElement, OldElementParameters>();
    for (const element of elements) {
      const transform = {...element.transform};
      const strokePoints: Point[] = [];
      if (element.strokePoints) {
        element.strokePoints.forEach((point) => { strokePoints.push({...point}); });
      }
      this.elements.set(element, {transform, strokePoints});
    }
  }

  undo(): void {
    this.changeTransform();
  }
  redo(): void {
    this.changeTransform();
  }

  changeTransform(): void {
    this.elements.forEach((parameters, element) => {
      const transform = {...element.transform};
      element.transform = {...parameters.transform};

      const strokePoints: Point[] = [];
      if (element.strokePoints) {
        element.strokePoints.forEach((point) => { strokePoints.push({...point}); });
        element.strokePoints = [];
        for (const point of parameters.strokePoints) {
          element.strokePoints.push({...point});
        }
      }

      this.elements.set(element, {transform, strokePoints});
      element.draw();
      element.svgHtml = this.sanitizer.bypassSecurityTrustHtml(element.svg);
    });
    this.deleteBoundingBoxMethod();
  }

  hasMoved(): boolean {
    const testElement = this.elements.keys().next().value as DrawElement;
    const parameters = this.elements.get(testElement);
    if (parameters) {
      return !(JSON.stringify(parameters.transform) === JSON.stringify(testElement.transform));
    }
    return false;
  }
}
