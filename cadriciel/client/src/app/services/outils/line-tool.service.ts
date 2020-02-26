import { Injectable } from '@angular/core';
import { AddSVGService } from '../command/add-svg.service';
import { CommandManagerService } from '../command/command-manager.service';
import { LineService } from '../stockage-svg/line.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { ToolManagerService } from './tool-manager.service';
import { ToolInterface } from './tool-interface';

export interface Point {
  x: number;
  y: number;
}

@Injectable({
  providedIn: 'root'
})
export class LineToolService implements ToolInterface {
  private isSimpleClick = true;
  ShiftPressPosition: Point;
  line = new LineService();

  cursor: Point = {x: 0, y: 0};

  constructor(public SVGStockage: SVGStockageService,
              public tools: ToolManagerService,
              public commands: CommandManagerService) { }

  onMouseMove(mouse: MouseEvent) {
    this.cursor = {x: mouse.offsetX, y: mouse.offsetY};
    if (mouse.shiftKey) {
      this.ShitPress();
    } else {
      this.ShiftRelease();
    }
  }

  onMouseClick() {
    this.commands.drawingInProgress = true;
    this.isSimpleClick = true;
    this.line.points.push({x: this.line.mousePosition.x, y: this.line.mousePosition.y});
    window.setTimeout(() => {
      if (this.isSimpleClick) {this.refreshSVG()}
    }, 250);
  }

  onDoubleClick(mouse: MouseEvent) {
    this.commands.drawingInProgress = false;
    this.isSimpleClick = false;
    if (this.line.points.length !== 0) {
      if (Math.abs(mouse.offsetX - this.line.points[0].x) <= 3
          && Math.abs(mouse.offsetY - this.line.points[0].y) <= 3) {
        this.line.points.pop();
        this.line.points.pop();
        this.line.isAPolygon = true;
      } else if (this.tools.activeTool.parameters[1].choosenOption === 'Avec points') {
        this.line.points.push({x: this.line.mousePosition.x, y: this.line.mousePosition.y});
      }
      this.line.draw();
      if (!this.line.isEmpty()) {
        this.commands.execute(new AddSVGService(this.line, this.SVGStockage));
      }
      this.line = new LineService();
    }
  }

  retirerPoint() {
    if (this.line.points.length > 1) {
      this.line.points.pop();
      this.refreshSVG();
    }
  }

  stockerCurseur() {
    this.ShiftPressPosition = {x: this.cursor.x, y: this.cursor.y};
  }

  ShitPress() {
    if (this.commands.drawingInProgress) {
      const lastPoint = this.line.points[this.line.points.length - 1];
      const angle = Math.atan((this.cursor.y - lastPoint.y) / (this.cursor.x - lastPoint.x));
      const alignment = Math.abs(Math.round(angle / (Math.PI / 4)));

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

  ShiftRelease() {
    this.line.mousePosition = this.cursor;
    this.refreshSVG();
  }

  refreshSVG() {
    this.line.tool = this.tools.activeTool;
    this.line.draw();
    this.SVGStockage.setOngoingSVG(this.line);
  }

  clear() {
    this.line = new LineService();
    this.ShiftPressPosition = {x: 0, y: 0};
    this.cursor = {x: 0, y: 0};
  }
}
