import { Injectable } from '@angular/core';
import { ColorParameterService } from '../color/color-parameter.service';
import { AddSVGService } from '../command/add-svg.service';
import { CommandManagerService } from '../command/command-manager.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { TraceSprayService } from '../stockage-svg/trace-spray.service';
import { Point } from './line-tool.service';
import { ToolInterface } from './tool-interface';
import { ToolManagerService } from './tool-manager.service';

@Injectable({
  providedIn: 'root'
})
export class DrawSprayService implements ToolInterface {

  trace: TraceSprayService;
  mousePosition: Point = {x: 0, y: 0};
  intervalMethodID: number;

  constructor(public stockageSVG: SVGStockageService,
              public tools: ToolManagerService,
              public colorParameter: ColorParameterService,
              public commands: CommandManagerService
             ) {
              this.trace = new TraceSprayService();
             }

  onMouseMove(souris: MouseEvent): void {
    if (this.commands.drawingInProgress) {
      this.mousePosition = {x: souris.offsetX, y: souris.offsetY};
    }
  }

  actualizeSVG(): void {
    this.trace.primaryColor = this.colorParameter.getPrimaryColor();
    this.trace.tool = this.tools.activeTool;
    this.trace.draw();
    this.stockageSVG.setOngoingSVG(this.trace);
    console.log(this.trace.SVG);
  }

  onMousePress(souris: MouseEvent): void {
    const frequence = this.tools.activeTool.parameters[1].value;
    this.commands.drawingInProgress = true;
    this.mousePosition = {x: souris.offsetX, y: souris.offsetY};
    window.clearInterval(this.intervalMethodID);
    this.intervalMethodID = window.setInterval(() => {
      this.addPoint();
      this.actualizeSVG();
    }, frequence ? 1000 / frequence : 1000);
  }

  addPoint(): void {
    const diameter = this.tools.activeTool.parameters[0].value;
    const position = Math.random() * (diameter ? diameter / 2 : 1);
    const angle = Math.random() * 2 * Math.PI;
    const x = this.mousePosition.x + position * Math.cos(angle);
    const y = this.mousePosition.y + position * Math.sin(angle);
    this.trace.points.push({x, y});
    this.actualizeSVG();
  }

  onMouseRelease(): void {
    if (this.commands.drawingInProgress) {
      if (this.trace.points.length > 0) {
        this.commands.execute(new AddSVGService(this.trace, this.stockageSVG));
      }
    }
    this.trace = new TraceSprayService();
    this.commands.drawingInProgress = false;
    window.clearInterval(this.intervalMethodID);
  }
}
