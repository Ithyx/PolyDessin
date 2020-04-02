import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RectangleService } from '../../stockage-svg/draw-element/basic-shape/rectangle.service';
import { Point } from '../../stockage-svg/draw-element/draw-element';
import { DrawingTool } from '../tool-manager.service';

export const rectangleSelectionTool: DrawingTool = {name: '',
                                             isActive: true,
                                             ID: -1,
                                             parameters: [
                                              {type: 'invisible', name: 'Épaisseur du contour', value: 3},
                                              {type: 'invisible', name: 'Type de tracé', chosenOption: 'Plein avec contour'}
                                            ],
                                             iconName: ''};

const enum RECTANGLE_COLOR {
  PRIMARY = 'rgba(0, 80, 130, 0.35)',
  SECONDARY = 'rgba(80, 80, 80, 0.45)'
}

const enum RECTANGLE_INVERTED_COLOR {
  PRIMARY = 'rgba(190, 70, 70, 0.35)',
  SECONDARY = 'rgba(80, 80, 80, 0.45)',
}

const LEFT_CLICK = 0;
const RIGHT_CLICK = 2;

@Injectable({
  providedIn: 'root'
})

export class SelectionRectangleService {
  ongoingSelection: boolean;
  rectangle: RectangleService;
  rectangleInverted: RectangleService;

  private initialPoint: Point;   // Coordonnées du clic initial de souris
  private basisPoint: Point;     // Coordonnées du point inférieur

  // Dimensions du rectangle
  private widthCalculated: number;
  private heightCalculated: number;

  constructor(private sanitizer: DomSanitizer) {
    this.ongoingSelection = false;
    this.initialPoint = {x: 0, y: 0};
    this.basisPoint = {x: 0, y: 0};
    this.widthCalculated = 0;
    this.heightCalculated = 0;
   }

  refreshSVGNormalSelection(): void {
    this.rectangle.updateParameters(rectangleSelectionTool);
    this.rectangle.primaryColor.RGBAString = RECTANGLE_COLOR.PRIMARY;
    this.rectangle.secondaryColor.RGBAString = RECTANGLE_COLOR.SECONDARY;
    this.rectangle.draw();
    this.rectangle.svgHtml = this.sanitizer.bypassSecurityTrustHtml(this.rectangle.svg);
  }

  refreshSVGInvertedSelection(): void {
    this.rectangleInverted.updateParameters(rectangleSelectionTool);
    this.rectangleInverted.primaryColor.RGBAString = RECTANGLE_INVERTED_COLOR.PRIMARY;
    this.rectangleInverted.secondaryColor.RGBAString = RECTANGLE_INVERTED_COLOR.SECONDARY;
    this.rectangleInverted.draw();
    this.rectangleInverted.svgHtml = this.sanitizer.bypassSecurityTrustHtml(this.rectangleInverted.svg);
  }

  mouseMove(mouse: MouseEvent): void {
    if (this.ongoingSelection) {
      // Calcule des valeurs pour former un rectangle
      this.widthCalculated = Math.abs(this.initialPoint.x - mouse.offsetX);
      this.heightCalculated = Math.abs(this.initialPoint.y - mouse.offsetY);

      this.basisPoint = {x: Math.min(this.initialPoint.x, mouse.offsetX), y: Math.min(this.initialPoint.y, mouse.offsetY)};
      if (mouse.buttons === RIGHT_CLICK) {
        this.rectangleInverted.points[0] = {x: this.basisPoint.x, y: this.basisPoint.y};
        this.rectangleInverted.points[1] = {x: this.basisPoint.x + this.widthCalculated, y: this.basisPoint.y + this.heightCalculated};
        this.refreshSVGInvertedSelection();
      } else if (mouse.button === LEFT_CLICK) {
        this.rectangle.points[0] = {x: this.basisPoint.x, y: this.basisPoint.y};
        this.rectangle.points[1] = {x: this.basisPoint.x + this.widthCalculated, y: this.basisPoint.y + this.heightCalculated};
        this.refreshSVGNormalSelection();
      }
    }
  }

  mouseDown(mouse: MouseEvent): void {
    if (mouse.button === RIGHT_CLICK) {
      this.rectangleInverted = new RectangleService();
      this.rectangleInverted.isDotted = true;
      this.initialPoint = {x: mouse.offsetX, y: mouse.offsetY};
      this.ongoingSelection = true;
    } else if (mouse.button === LEFT_CLICK) {
      this.rectangle = new RectangleService();
      this.rectangle.isDotted = true;
      this.initialPoint = {x: mouse.offsetX, y: mouse.offsetY};
      this.ongoingSelection = true;
    }
  }

  mouseUp(): void {
    this.basisPoint = {x: 0, y: 0};
    this.heightCalculated = 0;
    this.widthCalculated = 0;
    this.ongoingSelection = false;
  }

}
