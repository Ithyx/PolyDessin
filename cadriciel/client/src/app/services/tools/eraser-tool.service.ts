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
  private selectedElements: DrawElement[];
  eraser: RectangleService;
  mousePosition: Point = {x: 0, y: 0};
  thickness: number;

  constructor(public tools: ToolManagerService,
              private sanitizer: DomSanitizer,
              public commands: CommandManagerService,
              public svgStockage: SVGStockageService,
              public selection: SelectionService) {
    this.eraser = new RectangleService();
    this.selectedElements = [];
    this.thickness = DEFAULT_THICKNESS;
  }

  makeSquare(): void {
    this.eraser.svg = '<rect x="' + this.mousePosition.x + '" y="' + this.mousePosition.y +
    '" width="' + this.thickness + '" height="' + this.thickness +
    '" stroke="rgba(0, 0, 0, 1)" fill="white" stroke-width="1"/>';
    this.eraser.svgHtml = this.sanitizer.bypassSecurityTrustHtml(this.eraser.svg);
    this.svgStockage.setOngoingSVG(this.eraser);
  }

  isInEraser(): void {
    for (const element of this.svgStockage.getCompleteSVG()) {
      if (!this.selectedElements.includes(element)) {
        for (const point of element.points) {
          if (this.belongsToSquare(point)) {
            console.log('add element', element);
            this.selectedElements.push(element);
          }
        }
      }
    }
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
    if (this.commands.drawingInProgress) {
      this.isInEraser();
    }
  }

  onMousePress(): void {
    this.commands.drawingInProgress = true;
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
    for (const element of this.selectedElements) {
      this.commands.execute(new RemoveSVGService(element, this.svgStockage));
    }
    this.selectedElements = [];
  }

  clear(): void {
    this.commands.drawingInProgress = false;
    this.eraser = new RectangleService();
    this.svgStockage.setOngoingSVG(this.eraser);
    this.selectedElements = [];
  }
}
