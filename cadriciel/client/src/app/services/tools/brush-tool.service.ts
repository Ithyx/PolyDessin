import { Injectable } from '@angular/core';
import { ColorParameterService } from '../color/color-parameter.service';
import { AddSVGService } from '../command/add-svg.service';
import { CommandManagerService } from '../command/command-manager.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { TraceBrushService } from '../stockage-svg/trace-brush.service';
import { ToolInterface } from './tool-interface';
import { ToolManagerService } from './tool-manager.service';

@Injectable({
  providedIn: 'root'
})
export class BrushToolService implements ToolInterface {

  trace: TraceBrushService;
  canClick: boolean;

  constructor(public SVGStockage: SVGStockageService,
              public tools: ToolManagerService,
              public colorParameter: ColorParameterService,
              public commands: CommandManagerService
             ) {
              this.trace = new TraceBrushService();
              this.canClick = true;
              }

  onMouseMove(mouse: MouseEvent): void {
    if (this.commands.drawingInProgress) {
      this.trace.points.push({x: mouse.offsetX, y: mouse.offsetY});
      this.refreshSVG();
    }
  }

  onMousePress(): void {
    this.commands.drawingInProgress = true;
    this.refreshSVG();
  }

  onMouseRelease(): void {
    if (this.commands.drawingInProgress) {
      if (this.trace.svg.includes('L')) {
        // on ne stocke le path que s'il n'y a au moins une ligne
        this.commands.execute(new AddSVGService(this.trace, this.SVGStockage));
      }
      this.trace = new TraceBrushService();
      this.commands.drawingInProgress = false;
      this.canClick = true;
    }
  }

  onMouseClick(mouse: MouseEvent): void {
    if (this.canClick) {
      if (this.tools.activeTool.parameters[0].value) {
        this.trace.points.push({x: mouse.offsetX, y: mouse.offsetY});
        this.trace.isAPoint = true;
        this.refreshSVG();
        this.commands.execute(new AddSVGService(this.trace, this.SVGStockage));
        this.trace = new TraceBrushService();
      }
      this.commands.drawingInProgress = false;
    } else { this.canClick = true; }
  }

  onMouseLeave(): void {
    if (this.commands.drawingInProgress) {
      this.commands.execute(new AddSVGService(this.trace, this.SVGStockage));
      this.trace = new TraceBrushService();
      this.commands.drawingInProgress = false;
    }
    this.canClick = false;
  }

  refreshSVG(): void {
    this.trace.primaryColor = {...this.colorParameter.primaryColor};
    this.trace.updateParameters(this.tools.activeTool);
    this.trace.draw();
    this.SVGStockage.setOngoingSVG(this.trace);
  }
}
