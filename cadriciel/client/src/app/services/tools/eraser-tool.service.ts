import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommandManagerService } from '../command/command-manager.service';
import { RectangleService } from '../stockage-svg/rectangle.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { Point } from './line-tool.service';
import { ToolInterface } from './tool-interface';
import { ToolManagerService } from './tool-manager.service';

@Injectable({
  providedIn: 'root'
})
export class EraserToolService implements ToolInterface {
  eraser: RectangleService;
  mousePosition: Point = {x: 0, y: 0};

  constructor(public tools: ToolManagerService,
              private sanitizer: DomSanitizer,
              public commands: CommandManagerService,
              public svgStockage: SVGStockageService) {
    this.eraser = new RectangleService();
  }

  makeSquare(): void {
    const thickness = this.tools.activeTool.parameters[0].value;
    this.eraser.svg = '<rect x="' + this.mousePosition.x + '" y="' + this.mousePosition.y +
    '" width="' + thickness + '" height="' + thickness +
    '" stroke="rgba(0, 0, 0, 1)" fill="white" stroke-width="1"/>';
    this.eraser.svgHtml = this.sanitizer.bypassSecurityTrustHtml(this.eraser.svg);
    this.svgStockage.setOngoingSVG(this.eraser);
  }

  onMouseMove(mouse: MouseEvent): void {
    this.mousePosition = {x: mouse.offsetX, y: mouse.offsetY};
    this.makeSquare();
  }

  onMousePress(mouse: MouseEvent): void {
    // BLA
  }

  onMouseRelease(): void {
    // bla
  }

  onMouseLeave(): void {
    this.eraser = new RectangleService();
    this.svgStockage.setOngoingSVG(this.eraser);
  }
}
