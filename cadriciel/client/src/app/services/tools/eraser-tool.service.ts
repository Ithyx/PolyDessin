import { Injectable } from '@angular/core';
import { CommandManagerService } from '../command/command-manager.service';
import { RectangleService } from '../stockage-svg/rectangle.service';
import { Point } from './line-tool.service';
import { ToolInterface } from './tool-interface';
import { ToolManagerService } from './tool-manager.service';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class EraserToolService implements ToolInterface {
  eraser: RectangleService;
  mousePosition: Point = {x: 0, y: 0};
  thickness: number;


  constructor(public tools: ToolManagerService,
              private sanitizer: DomSanitizer,
              public commands: CommandManagerService) {

    this.thickness = 0;
    this.eraser = new RectangleService();
  }

  makeSquare(): void {
    this.eraser.SVG = '<rect x="' + this.mousePosition.x + '" y="' + this.mousePosition.y +
    '" width="' + this.thickness + '" height="' + this.thickness +
    '" stroke="rgba(0, 0, 0, 1)" fill="white" stroke-width="1"/>';
    this.eraser.SVGHtml = this.sanitizer.bypassSecurityTrustHtml(this.eraser.SVG);
  }

  onMouseMove(mouse: MouseEvent): void {
    if (this.commands.drawingInProgress) {
      this.mousePosition = {x: mouse.offsetX, y: mouse.offsetY};
      this.makeSquare();
    }
  }

  onMousePress(mouse: MouseEvent): void {
    // BLA
  }

  onMouseRelease(): void {
    // bla
  }
}
