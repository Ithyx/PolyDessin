import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DrawElement, Point, TransformMatrix } from '../stockage-svg/draw-element/draw-element';
import { Command } from './command';
import { BasicShapeService } from '../stockage-svg/draw-element/basic-shape/basic-shape.service';

interface OldElementParameters {
  transforms: TransformMatrix[];
  strokePoints: Point[];
  pointMin: Point;
  pointMax: Point;
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
      const transforms = [{...element.transform}];
      if (element.strokeTransform) {
        transforms.push(element.strokeTransform);
      }
      const strokePoints: Point[] = [];
      if (element.strokePoints) {
        element.strokePoints.forEach((point) => { strokePoints.push({...point}); });
      }
      this.elements.set(element,
        {transforms, strokePoints, pointMin: {...element.pointMin}, pointMax: {...element.pointMax}}
      );
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
      const transforms = [{...element.transform}];
      element.transform = {...parameters.transforms[0]};

      if (element.strokeTransform) {
        transforms.push({...element.strokeTransform});
        element.strokeTransform = {...parameters.transforms[1]};
      }

      const strokePoints: Point[] = [];
      if (element.strokePoints) {
        element.strokePoints.forEach((point) => { strokePoints.push({...point}); });
        element.strokePoints = [];
        for (const point of parameters.strokePoints) {
          element.strokePoints.push({...point});
        }
      }

      const pointMin = {...element.pointMin};
      element.pointMin = {...parameters.pointMin};
      const pointMax = {...element.pointMax};
      element.pointMax = {...parameters.pointMax};

      this.elements.set(element, {transforms, strokePoints, pointMin, pointMax});
      element.draw();
      console.log(element.svg);
      element.svgHtml = this.sanitizer.bypassSecurityTrustHtml(element.svg);
    });
    this.deleteBoundingBoxMethod();
  }

  hasMoved(): boolean {
    const element = Array.from(this.elements.keys())[0];
    const parameters = this.elements.get(element);
    return (parameters && (JSON.stringify(parameters.transforms[0]) !== JSON.stringify(element.transform))) as boolean;
  }
}
