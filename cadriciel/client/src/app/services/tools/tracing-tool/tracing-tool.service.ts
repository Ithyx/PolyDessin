import { Injectable } from '@angular/core';
import { ColorParameterService } from '../../color/color-parameter.service';
import { AddSVGService } from '../../command/add-svg.service';
import { CommandManagerService } from '../../command/command-manager.service';
import { SVGStockageService } from '../../stockage-svg/svg-stockage.service';
import { TraceService } from '../../stockage-svg/trace/trace.service';
import { ToolInterface } from '../tool-interface';
import { ToolManagerService } from '../tool-manager.service';

@Injectable({
  providedIn: 'root'
})
export abstract class TracingToolService implements ToolInterface {
  protected trace: TraceService;
  private canClick: boolean;

  constructor(private stockageSVG: SVGStockageService,
              private tools: ToolManagerService,
              private colorParameter: ColorParameterService,
              protected commands: CommandManagerService
             ) {
               this.resetTrace();
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
        this.commands.execute(new AddSVGService(this.trace, this.stockageSVG));
      }
      this.resetTrace();
      this.canClick = true;
    }
  }

  onMouseClick(mouse: MouseEvent): void {
    if (this.canClick) {
      if (this.tools.activeTool.parameters[0].value) {
        this.trace.points.push({x: mouse.offsetX, y: mouse.offsetY});
        this.trace.isAPoint = true;
        this.refreshSVG();
        this.commands.execute(new AddSVGService(this.trace, this.stockageSVG));
      }
      this.resetTrace();
    } else { this.canClick = true; }
  }

  onMouseLeave(): void {
    if (this.commands.drawingInProgress) {
      this.commands.execute(new AddSVGService(this.trace, this.stockageSVG));
      this.resetTrace();
    }
    this.canClick = false;
  }

  refreshSVG(): void {
    this.trace.primaryColor = {...this.colorParameter.primaryColor};
    this.trace.updateParameters(this.tools.activeTool);
    this.trace.draw();
    this.stockageSVG.setOngoingSVG(this.trace);
  }

  abstract resetTrace(): void;
}
