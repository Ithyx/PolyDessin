import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RectangleService } from '../../stockage-svg/rectangle.service';
import { Point } from '../line-tool.service';
import { DrawingTool } from '../tool-manager.service';

const LEFT_CLICK = 0;
const RIGHT_CLICK = 2;

const rectangleSelectionTool: DrawingTool = {name: '',
                                             isActive: true,
                                             ID: -1,
                                             parameters: [
                                              {type: 'invisible', name: 'Épaisseur du contour', value: 3},
                                              {type: 'invisible', name: 'Type de tracé', chosenOption: 'Plein avec contour'}
                                            ],
                                             iconName: ''};

@Injectable({
  providedIn: 'root'
})

export class SelectionRectangleService {
  ongoingSelection: boolean;
  rectangle: RectangleService;
  rectangleInverted: RectangleService;

  initialPoint: Point;   // Coordonnées du clic initial de souris
  basisPoint: Point;     // Coordonnées du point inférieur 

  // Dimensions du rectangle
  widthCalculated: number;
  heightCalculated: number;

  constructor(private sanitizer: DomSanitizer) {
    this.ongoingSelection = false;
    this.initialPoint = {x: 0, y: 0};
    this.basisPoint = {x: 0, y: 0};
    this.widthCalculated = 0;
    this.heightCalculated = 0;
   }

  refreshSVGNormalSelection(): void {
    this.rectangle.updateParameters(rectangleSelectionTool);
    this.rectangle.primaryColor.RGBAString = 'rgba(0, 80, 130, 0.35)';
    this.rectangle.secondaryColor.RGBAString = 'rgba(80, 80, 80, 0.45)';
    this.rectangle.draw();
    this.rectangle.svgHtml = this.sanitizer.bypassSecurityTrustHtml(this.rectangle.svg);
  }

  refreshSVGInvertedSelection(): void {
    this.rectangleInverted.updateParameters(rectangleSelectionTool);
    this.rectangleInverted.primaryColor.RGBAString = 'rgba(190, 70, 70, 0.35)';
    this.rectangleInverted.secondaryColor.RGBAString = 'rgba(80, 80, 80, 0.45)';
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
        console.log('Inverted');
        this.rectangleInverted.points[0] = this.basisPoint;
        this.rectangleInverted.points[1] = {x: this.basisPoint.x + this.widthCalculated, y: this.basisPoint.y + this.heightCalculated};
        this.refreshSVGInvertedSelection();
      } else if (mouse.button === LEFT_CLICK) {
        console.log('Normal');
        this.rectangle.points[0] = this.basisPoint;
        this.rectangle.points[1] = {x: this.basisPoint.x + this.widthCalculated, y: this.basisPoint.y + this.heightCalculated};
        this.refreshSVGNormalSelection();
      }
    }
  }

  mouseDown(mouse: MouseEvent): void {
    if (mouse.buttons === RIGHT_CLICK) {
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
