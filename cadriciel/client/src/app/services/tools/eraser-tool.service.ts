import { Injectable } from '@angular/core';
import { CommandManagerService } from '../command/command-manager.service';
import { Point } from './line-tool.service';
import { ToolInterface } from './tool-interface';
import { ToolManagerService } from './tool-manager.service';

@Injectable({
  providedIn: 'root'
})
export class EraserToolService implements ToolInterface {

  mousePosition: Point = {x: 0, y: 0};
  thickness: number;

  constructor(public tools: ToolManagerService,
              public commands: CommandManagerService) {

    this.thickness = 0;
  }

  onMouseMove(mouse: MouseEvent): void {
    if (this.commands.drawingInProgress) {
      this.mousePosition = {x: mouse.offsetX, y: mouse.offsetY};
    }
  }

  onMousePress(mouse: MouseEvent): void {
    // BLA
  }
}
