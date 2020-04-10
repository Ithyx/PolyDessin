import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DrawElement, TransformMatrix } from '../stockage-svg/draw-element/draw-element';
import { Command } from './command';

@Injectable({
  providedIn: 'root'
})
export class TransformSvgService implements Command {

  private elements: Map<DrawElement, TransformMatrix>;

  constructor(elements: DrawElement[],
              private sanitizer: DomSanitizer,
              private deleteBoundingBoxMethod: () => void) {
    this.elements = new Map<DrawElement, TransformMatrix>();
    for (const element of elements) {
      this.elements.set(element, {...element.transform});
    }
  }

  undo(): void {
    this.changeTransform();
  }
  redo(): void {
    this.changeTransform();
  }

  changeTransform(): void {
    this.elements.forEach((transform, element) => {
      const newTransform = {...element.transform};
      element.transform = {...transform};
      this.elements.set(element, newTransform);
      element.draw();
      element.svgHtml = this.sanitizer.bypassSecurityTrustHtml(element.svg);
    });
    this.deleteBoundingBoxMethod();
  }

  hasMoved(): boolean {
    const testElement = Array.from(this.elements.keys())[0];
    const transform = this.elements.get(testElement);
    return !(JSON.stringify(transform) === JSON.stringify(testElement.transform));
  }
}
