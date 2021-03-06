import { Injectable } from '@angular/core';
import { ColorParameterService } from '../color/color-parameter.service';
import { AddSVGService } from '../command/add-svg.service';
import { CommandManagerService } from '../command/command-manager.service';
import { Point } from '../stockage-svg/draw-element/draw-element';
import { LineService } from '../stockage-svg/draw-element/line.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { ToolInterface } from './tool-interface';
import { ToolManagerService } from './tool-manager.service';

const CLICK_DELAY = 250;
const POLYGON_DISTANCE = 3;
const ANGLE_DIVIDER = 4;

@Injectable({
  providedIn: 'root'
})
export class LineToolService implements ToolInterface {
  private isSimpleClick: boolean;
  private line: LineService;

  private cursor: Point = {x: 0, y: 0};

  constructor(private svgStockage: SVGStockageService,
              private tools: ToolManagerService,
              private commands: CommandManagerService,
              private colorParameter: ColorParameterService
              ) {
                this.line = new LineService();
                this.isSimpleClick = true;
              }

  onMouseMove(mouse: MouseEvent): void {
    this.cursor = {x: mouse.offsetX, y: mouse.offsetY};
    if (mouse.shiftKey) {
      this.shiftPress();
    } else {
      this.shiftRelease();
    }
  }

  onMouseClick(): void {
    this.commands.drawingInProgress = true;
    this.isSimpleClick = true;
    this.line.points.push({x: this.line.mousePosition.x, y: this.line.mousePosition.y});
    window.setTimeout(this.mouseClickCallback.bind(this), CLICK_DELAY);
  }

  mouseClickCallback(): void {
    if (this.isSimpleClick) { this.refreshSVG(); }
  }

  mouseCloseToFirstPoint(mouse: MouseEvent): boolean {
    const xValuesClose = Math.abs(mouse.offsetX - this.line.points[0].x) <= POLYGON_DISTANCE;
    const yValuesClose = Math.abs(mouse.offsetY - this.line.points[0].y) <= POLYGON_DISTANCE;
    return xValuesClose && yValuesClose;
  }

  onDoubleClick(mouse: MouseEvent): void {
    this.commands.drawingInProgress = false;
    this.isSimpleClick = false;
    if (this.line.points.length !== 0) {
      if (this.mouseCloseToFirstPoint(mouse)) {
        this.line.points.pop();
        this.line.points.pop();
        this.line.isAPolygon = true;
      } else if (this.tools.activeTool.parameters[1].chosenOption === 'Avec points') {
        this.line.points.pop();
        this.line.points.pop();
        this.line.points.push({x: this.line.mousePosition.x, y: this.line.mousePosition.y});
      }
      this.line.draw();
      if (!this.line.isEmpty()) {
        this.commands.execute(new AddSVGService([this.line], this.svgStockage));
      }
      this.line = new LineService();
      this.line.mousePosition = this.cursor;
    }
  }

  removePoint(): void {
    if (this.line.points.length > 1) {
      this.line.points.pop();
      this.refreshSVG();
    }
  }

  shiftPress(): void {
    if (this.commands.drawingInProgress) {
      const lastPoint = this.line.points[this.line.points.length - 1];
      const angle = Math.atan((this.cursor.y - lastPoint.y) / (this.cursor.x - lastPoint.x));
      const alignment = Math.abs(Math.round(angle / (Math.PI / ANGLE_DIVIDER)));

      // alignement = 0 lorsque angle = 0,180­°
      // alignement = 1 lorsque angle = 45,135,225,315°
      // alignement = 2 lorsque angle = 90,270°
      if (alignment === 0) {
        this.line.mousePosition = {x: this.cursor.x, y: lastPoint.y};
      } else if (alignment === 1) {
        if (Math.sign(this.cursor.x - lastPoint.x) === Math.sign(this.cursor.y - lastPoint.y)) {
          this.line.mousePosition.y = this.cursor.x - lastPoint.x + lastPoint.y;
        } else {
          this.line.mousePosition.y = lastPoint.x - this.cursor.x + lastPoint.y;
        }
        this.line.mousePosition.x = this.cursor.x;
      } else {
        this.line.mousePosition = {x: lastPoint.x, y: this.cursor.y};
      }
      this.refreshSVG();
    }
  }

  shiftRelease(): void {
    this.line.mousePosition = {x: this.cursor.x, y: this.cursor.y};
    this.refreshSVG();
  }

  refreshSVG(): void {
    this.line.primaryColor = {...this.colorParameter.primaryColor};
    this.line.updateParameters(this.tools.activeTool);
    this.line.draw();
    this.svgStockage.setOngoingSVG(this.line);
  }

  clear(): void {
    this.line = new LineService();
    this.line.mousePosition = this.cursor;
    this.cursor = {x: 0, y: 0};
    this.svgStockage.setOngoingSVG(this.line);
  }
}
