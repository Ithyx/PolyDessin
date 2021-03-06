import { Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ColorParameterService } from '../color/color-parameter.service';
import { AddSVGService } from '../command/add-svg.service';
import { CommandManagerService } from '../command/command-manager.service';
import { Point } from '../stockage-svg/draw-element/draw-element';
import { SprayService } from '../stockage-svg/draw-element/spray.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { ToolInterface } from './tool-interface';
import { ToolManagerService } from './tool-manager.service';

export const ONE_SECOND_DELAY = 1000;
export const POINTS_PER_EMISSION = 20;

@Injectable({
  providedIn: 'root'
})
export class SprayToolService implements ToolInterface {

  trace: SprayService;
  mousePosition: Point = {x: 0, y: 0};
  intervalSubscription: Subscription;

  constructor(private stockageSVG: SVGStockageService,
              private tools: ToolManagerService,
              private colorParameter: ColorParameterService,
              private commands: CommandManagerService
             ) {
              this.resetTrace();
            }

  onMouseMove(mouse: MouseEvent): void {
    if (this.commands.drawingInProgress) {
      this.mousePosition = {x: mouse.offsetX, y: mouse.offsetY};
    }
  }

  onMousePress(mouse: MouseEvent): void {
    const frequence = this.tools.activeTool.parameters[1].value;
    const delay = frequence ? ONE_SECOND_DELAY / frequence : ONE_SECOND_DELAY;
    this.resetTrace();
    this.commands.drawingInProgress = true;
    this.mousePosition = {x: mouse.offsetX, y: mouse.offsetY};
    const counter = interval(delay);
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
    this.intervalSubscription = counter.subscribe(this.onInterval.bind(this));
  }

  onMouseRelease(): void {
    if (this.commands.drawingInProgress) {
      if (this.trace.points.length > 0) {
        this.commands.execute(new AddSVGService([this.trace], this.stockageSVG));
      }
    }
    this.resetTrace();
    this.commands.drawingInProgress = false;
    this.intervalSubscription.unsubscribe();
  }

  resetTrace(): void {
    this.trace = new SprayService();
    this.trace.primaryColor = {...this.colorParameter.primaryColor};
    this.trace.updateParameters(this.tools.activeTool);
  }

  onInterval(): void {
    for (let i = 0; i < POINTS_PER_EMISSION; ++i) {
        this.trace.addPoint(this.mousePosition);
      }
    this.stockageSVG.setOngoingSVG(this.trace);
  }
}
