import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommandManagerService } from '../command/command-manager.service';
import { RemoveSVGService } from '../command/remove-svg.service';
import { DrawElement } from '../stockage-svg/draw-element';
import { RectangleService } from '../stockage-svg/rectangle.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { Point } from './line-tool.service';
import { SelectionService } from './selection/selection.service';
import { ToolInterface } from './tool-interface';
import { ToolManagerService } from './tool-manager.service';

const DEFAULT_THICKNESS = 10;

@Injectable({
  providedIn: 'root'
})
export class EraserToolService implements ToolInterface {
  selectedDrawElement: DrawElement[];
  selectedSVGElement: SVGElement[];
  eraser: RectangleService;
  square: SVGRect;
  mousePosition: Point = {x: 0, y: 0};
  thickness: number;
  drawing: SVGElement;

  constructor(public tools: ToolManagerService,
              private sanitizer: DomSanitizer,
              public commands: CommandManagerService,
              public svgStockage: SVGStockageService,
              public selection: SelectionService) {
    this.eraser = new RectangleService();
    this.selectedDrawElement = [];
    this.selectedSVGElement = [];
    this.thickness = DEFAULT_THICKNESS;
  }

  makeSquare(): void {
    this.eraser.svg = '<rect class="eraser" x="' + this.mousePosition.x + '" y="' + this.mousePosition.y +
    '" width="' + this.thickness + '" height="' + this.thickness +
    '" stroke="rgba(0, 0, 0, 1)" fill="white" stroke-width="1"></rect>';
    this.eraser.svgHtml = this.sanitizer.bypassSecurityTrustHtml(this.eraser.svg);
    this.svgStockage.setOngoingSVG(this.eraser);
  }

  isInEraser(): void {
    // NOTE : Les console.log(...) ralentissent considérament l'application - H.

    // On regarde quels elements ont une boundingBox en intersection avec l'efface
    const elements = (this.drawing as SVGSVGElement).getIntersectionList(this.square, this.drawing);
    // console.log('IntersectionList', elements);

    // En convertissant en SVGPathElement, on peut obtenir les coordonnés x y de chaque point à une longueur donnée
    elements.forEach((element) => {
      const length = (element as SVGPathElement).getTotalLength();
      // console.log('Element lenght', length);
      for (let index = 0; index < length; index++) {
        const domPoint = (element as SVGPathElement).getPointAtLength(index);
        if (this.belongsToSquare({x: domPoint.x, y: domPoint.y })         // On vérifie si le point appartient à l'efface
            && !this.selectedSVGElement.includes(element)                 // On vérifie si on a pas deja l'element
            && !element.outerHTML.includes('class="eraser"')) {           // On vérifie que l'element n'est pas l'efface
          // console.log('BelongToSqare', element.outerHTML, this.eraser.svg);
          this.selectedSVGElement.push(element);
        }
      }
    });
    // console.log('SelectedElement2', this.selectedSVGElement);

    for (const element2 of this.selectedSVGElement) {
      for (const element of this.svgStockage.getCompleteSVG()) {
        // console.log('Element2 HTML', element2.outerHTML);
        // console.log('Element HTML', element.svg);
        if (element2.outerHTML === element.svg
            && !this.selectedDrawElement.includes(element)) {
          this.selectedDrawElement.push(element);
        }
      }
    }
    // console.log('SelectedElement', this.selectedDrawElement);
    this.selectedSVGElement = [];
  }

  belongsToSquare(point: Point): boolean {
    const isInSquareX = (point.x >= this.mousePosition.x) && (point.x <= this.mousePosition.x + this.thickness);
    const isInSquareY = (point.y >= this.mousePosition.y) && (point.y <= this.mousePosition.y + this.thickness);
    return isInSquareX && isInSquareY;
  }

  onMouseMove(mouse: MouseEvent): void {
    this.thickness = (this.tools.activeTool.parameters[0].value) ? this.tools.activeTool.parameters[0].value : DEFAULT_THICKNESS;
    this.mousePosition = {x: mouse.offsetX, y: mouse.offsetY};
    this.makeSquare();
    this.square = (this.drawing as SVGSVGElement).createSVGRect();
    this.square.x = mouse.offsetX;
    this.square.y = mouse.offsetY;
    this.square.width = this.thickness;
    this.square.height = this.thickness;
    if (this.commands.drawingInProgress) {
      this.isInEraser();
    }
  }

  onMousePress(): void {
    this.commands.drawingInProgress = true;
  }

  onMouseClick(mouse: MouseEvent): void {
    this.isInEraser();
    this.removeElements();
  }

  onMouseRelease(): void {
    this.commands.drawingInProgress = false;
    this.removeElements();
  }

  onMouseLeave(): void {
    this.removeElements();
    this.clear();
  }

  removeElements(): void {
    for (const element of this.selectedDrawElement) {
      this.commands.execute(new RemoveSVGService(element, this.svgStockage));
    }
    this.selectedDrawElement = [];
    this.selectedSVGElement = [];
  }

  clear(): void {
    this.commands.drawingInProgress = false;
    this.eraser = new RectangleService();
    this.svgStockage.setOngoingSVG(this.eraser);
    this.selectedDrawElement = [];
    this.selectedSVGElement = [];
  }
}
