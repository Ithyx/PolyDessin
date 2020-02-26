import { Injectable } from '@angular/core';
import { AddSVGService } from '../command/add-svg.service';
import { CommandManagerService } from '../command/command-manager.service';
import { ColorParameterService } from '../couleur/color-parameter.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { TraceBrushService } from '../stockage-svg/trace-brush.service';
import { ToolManagerService } from './tool-manager.service';
import { ToolInterface } from './tool-interface';

@Injectable({
  providedIn: 'root'
})
export class BrushToolService implements ToolInterface {

  constructor(public SVGStockage: SVGStockageService,
              public tools: ToolManagerService,
              public colorParameter: ColorParameterService,
              public commands: CommandManagerService) { }

  trace = new TraceBrushService();
  canClick = true;

  onMouseMove(mouse: MouseEvent) {
    if (this.commands.drawingInProgress) {
      this.trace.points.push({x: mouse.offsetX, y: mouse.offsetY});
      this.refreshSVG();
    }
  }

  onMousePress() {
    this.commands.drawingInProgress = true;
    this.refreshSVG();
  }

  onMouseRelease() {
    if (this.commands.drawingInProgress) {
      if (this.trace.SVG.includes('L')) {
        // on ne stocke le path que s'il n'y a au moins une ligne
        this.commands.execute(new AddSVGService(this.trace, this.SVGStockage));
      }
      this.trace = new TraceBrushService();
      this.commands.drawingInProgress = false;
      this.canClick = true;
    }
  }

  onMouseClick(mouse: MouseEvent) {
    if (this.canClick) {
      if (this.tools.activeTool.parameters[0].value) {
        this.trace.points.push({x: mouse.offsetX, y: mouse.offsetY});
        this.trace.isAPoint = true;
        this.refreshSVG();
        this.commands.execute(new AddSVGService(this.trace, this.SVGStockage));
        this.trace = new TraceBrushService();
      }
      this.commands.drawingInProgress = false;
    } else {this.canClick = true};
  }

  onMouseLeave() {
    if (this.commands.drawingInProgress) {
      this.commands.execute(new AddSVGService(this.trace, this.SVGStockage));
      this.trace = new TraceBrushService();
      this.commands.drawingInProgress = false;
    }
    this.canClick = false;
  }

  refreshSVG() {
    this.trace.primaryColor = this.colorParameter.getPrimaryColor();
    this.trace.tool = this.tools.activeTool;
    this.trace.draw();
    this.SVGStockage.setOngoingSVG(this.trace);
  }
}
