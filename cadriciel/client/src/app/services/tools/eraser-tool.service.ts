import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommandManagerService } from '../command/command-manager.service';
import { RemoveSVGService } from '../command/remove-svg.service';
import { DrawElement } from '../stockage-svg/draw-element';
import { EllipseService } from '../stockage-svg/ellipse.service';
import { PolygonService } from '../stockage-svg/polygon.service';
import { RectangleService } from '../stockage-svg/rectangle.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { Point } from './line-tool.service';
import { ENDING_ANGLE, STARTING_ANGLE } from './polygon-tool.service';
import { SelectionService } from './selection/selection.service';
import { ToolInterface } from './tool-interface';
import { ToolManagerService } from './tool-manager.service';

const DEFAULT_THICKNESS = 10;
const ANGLE_PRECISION = 8;

@Injectable({
  providedIn: 'root'
})
export class EraserToolService implements ToolInterface {
  selectedDrawElement: DrawElement[];
  selectedSVGElement: SVGElement[];
  square: SVGRect;
  mousePosition: Point = {x: 0, y: 0};
  thickness: number;
  drawing: SVGElement;

  constructor(public tools: ToolManagerService,
              private sanitizer: DomSanitizer,
              public commands: CommandManagerService,
              public svgStockage: SVGStockageService,
              public selection: SelectionService) {
    this.selectedDrawElement = [];
    this.selectedSVGElement = [];
    this.thickness = DEFAULT_THICKNESS;
  }

  makeSquare(mouse: MouseEvent): void {
    this.square = (this.drawing as SVGSVGElement).createSVGRect();
    this.square.x = mouse.offsetX - this.thickness / 2;
    this.square.y = mouse.offsetY - this.thickness / 2;
    this.square.width = this.thickness;
    this.square.height = this.thickness;

    const eraser = new RectangleService();
    eraser.svg = '<rect class="eraser" x="' + this.square.x + '" y="' + this.square.y +
    '" width="' + this.square.width + '" height="' + this.square.height +
    '" stroke="rgba(0, 0, 0, 1)" fill="white" stroke-width="1"></rect>';
    eraser.svgHtml = this.sanitizer.bypassSecurityTrustHtml(eraser.svg);
    this.svgStockage.setOngoingSVG(eraser);
  }

  isInEraser(): void {
    // On regarde quels elements ont une boundingBox en intersection avec l'efface
    const intersectionElements = (this.drawing as SVGSVGElement).getIntersectionList(this.square, this.drawing);

    // En convertissant en SVGPathElement, on peut obtenir les coordonnés x y de chaque point à une longueur donnée
    intersectionElements.forEach((element) => {
      if (!this.selectedSVGElement.includes(element)                      // On vérifie si on a pas deja l'element
          && !element.outerHTML.includes('class="eraser"')                // On vérifie que l'element n'est pas l'efface
          && !element.outerHTML.includes('class="grid"')) {               // On vérifie que l'element n'est pas la grille
        const length = (element as SVGPathElement).getTotalLength();
        // TODO: Il est n'est pas forcément utile de d'incrémenr l'indexde 1 en 1. Chercher la valeur limite de
        // TODO: l'index permettrait d'éviter des calculs
        for (let index = 0; index < length; index += 3) {
          const domPoint = (element as SVGPathElement).getPointAtLength(index);
          if (this.belongsToSquare({x: domPoint.x, y: domPoint.y })) {    // On vérifie si le point appartient à l'efface
            this.selectedSVGElement.push(element);

            // TODO: Possible gain de performance avec l'association SVGElement à DrawElement en déplaçant la boucle for ligne 71 ici

          }
        }
      }
    });

    for (const element of this.svgStockage.getCompleteSVG()) {
      element.erasingEvidence = false;
      if (!this.selectedDrawElement.includes(element)) {
        if (this.isPointInPoly(element, this.mousePosition)) {
          this.selectedDrawElement.push(element);
          element.erasingEvidence = true;     // Mise en évidence (rouge)
        } else {
          for (const element2 of this.selectedSVGElement) {
            if (element.svg.includes(element2.outerHTML) && !this.selectedDrawElement.includes(element)) {
              this.selectedDrawElement.push(element);
              element.erasingEvidence = true;     // Mise en évidence (rouge)
            }
          }
        }
      }
      element.draw();
      element.svgHtml = this.sanitizer.bypassSecurityTrustHtml(element.svg);
    }

    if (this.commands.drawingInProgress) {
      this.removeElements();
    } else {
      this.selectedDrawElement = [];
      this.selectedSVGElement = [];
    }
  }

  belongsToSquare(point: Point): boolean {
    const isInSquareX = (point.x >= this.square.x) && (point.x <= this.square.x + this.thickness);
    const isInSquareY = (point.y >= this.square.y) && (point.y <= this.square.y + this.thickness);
    return isInSquareX && isInSquareY;
  }

  // + Jonas Raoni Soares Silva
  // @ http://jsfromhell.com/math/is-point-in-poly [rev. #0]
  isPointInPoly(element: DrawElement, point: Point): boolean {
    if (element.chosenOption !== 'Plein' && element.chosenOption !== 'Plein avec contour') {
      return false;
    }

    let polygon: Point[] = [];
    if (element instanceof RectangleService) {
      polygon.push(element.points[0]);
      polygon.push({x: element.points[0].x + element.getWidth(), y: element.points[0].y});
      polygon.push(element.points[1]);
      polygon.push({x: element.points[1].x - element.getWidth(), y: element.points[1].y});
    } else if (element instanceof EllipseService) {
      const radius: Point = {x: element.getWidth() / 2, y: element.getHeight() / 2};
      const center: Point = {x: element.points[0].x + radius.x, y: element.points[0].y + radius.y};
      for (let angle = STARTING_ANGLE; angle < ENDING_ANGLE; angle += Math.PI / ANGLE_PRECISION) {
        polygon.push({x: center.x + radius.x * Math.cos(angle), y: center.y + radius.y * Math.sin(angle)});
      }
    } else if (element instanceof PolygonService) {
      polygon = element.points;
    }

    let isInPolygon = false;
    let i = -1;
    for (let j = polygon.length - 1; ++i < polygon.length; j = i) {
      if (((polygon[i].y <= point.y && point.y < polygon[j].y) || (polygon[j].y <= point.y && point.y < polygon[i].y))
          && (point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)) {
        isInPolygon = !isInPolygon;
      }
    }
    return isInPolygon;
  }

  onMouseMove(mouse: MouseEvent): void {
    this.thickness = (this.tools.activeTool.parameters[0].value) ? this.tools.activeTool.parameters[0].value : DEFAULT_THICKNESS;
    this.mousePosition = {x: mouse.offsetX, y: mouse.offsetY};
    this.makeSquare(mouse);
    this.isInEraser();
  }

  onMousePress(): void {
    this.commands.drawingInProgress = true;
  }

  onMouseClick(mouse: MouseEvent): void {
    this.commands.drawingInProgress = true;
    this.thickness = (this.tools.activeTool.parameters[0].value) ? this.tools.activeTool.parameters[0].value : DEFAULT_THICKNESS;
    this.mousePosition = {x: mouse.offsetX, y: mouse.offsetY};
    this.makeSquare(mouse);
    this.isInEraser();
    this.commands.drawingInProgress = false;
  }

  onMouseRelease(): void {
    this.commands.drawingInProgress = false;
    this.removeElements();
  }

  onMouseLeave(): void {
    // this.removeElements();
    this.clear();
  }

  removeElements(): void {
    for (const element of this.selectedDrawElement) {
      element.erasingEvidence = false;
      element.draw();
      element.svgHtml = this.sanitizer.bypassSecurityTrustHtml(element.svg);
    }
    if (this.selectedDrawElement.length !== 0) {
      this.commands.execute(new RemoveSVGService(this.selectedDrawElement, this.svgStockage));
    }
    this.selectedDrawElement = [];
    this.selectedSVGElement = [];
  }

  clear(): void {
    this.commands.drawingInProgress = false;
    this.svgStockage.setOngoingSVG(new RectangleService());
    this.selectedDrawElement = [];
    this.selectedSVGElement = [];
  }
}
