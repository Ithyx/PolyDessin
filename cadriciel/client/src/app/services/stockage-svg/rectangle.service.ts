import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Point } from '../tools/line-tool.service';
import { DrawingTool } from '../tools/tool-manager.service';
import { Color, DrawElement, ERASING_COLOR_STRING_INIT, ERASING_COLOR_VALUES_INIT } from './draw-element';

@Injectable({
  providedIn: 'root'
})
export class RectangleService implements DrawElement {
  svg: string;
  svgHtml: SafeHtml;

  points: Point[];
  isSelected: boolean;
  erasingEvidence: boolean;

  primaryColor: Color;
  secondaryColor: Color;
  erasingColor: Color;

  thickness: number;
  chosenOption: string;
  perimeter: string;
  isDotted: boolean;

  pointMin: Point;
  pointMax: Point;
  translate: Point;

  constructor() {
    this.svgHtml = '';
    this.primaryColor = {
      RGBAString: '',
      RGBA: [0, 0, 0, 0]
    };
    this.secondaryColor = {
      RGBAString: '',
      RGBA: [0, 0, 0, 0]
    };
    this.erasingColor = {
      RGBAString: ERASING_COLOR_STRING_INIT,
      RGBA: ERASING_COLOR_VALUES_INIT
    };
    this.points = [{x: 0, y: 0},    // points[0], coin haut gauche (base)
                   {x: 0, y: 0}];   // points[1], coin bas droite
    this.isSelected = false;
    this.erasingEvidence = false;
    this.translate = { x: 0, y: 0};
  }

  getWidth(): number {
    return Math.abs(this.points[1].x - this.points[0].x);
  }

  getHeight(): number {
    return Math.abs(this.points[1].y - this.points[0].y);
  }

  draw(): void {
    if ((this.getWidth() === 0 || this.getHeight() === 0) && this.chosenOption !== 'Plein') {
      this.drawLine();
    } else {
      this.drawRectangle();
    }
    this.drawPerimeter();
  }

  drawLine(): void {
    this.svg = '<line stroke-linecap="square'
      + '" transform=" translate(' + this.translate.x + ' ' + this.translate.y
      + ')" stroke="' + ((this.erasingEvidence) ? this.erasingColor.RGBAString :  this.secondaryColor.RGBAString)
      + '" stroke-width="' + this.thickness
      + (this.isDotted ? '"stroke-dasharray="2, 8"'  : '')
      + '" x1="' + this.points[0].x + '" y1="' + this.points[0].y
      + '" x2="' + (this.points[0].x + this.getWidth())
      + '" y2="' + (this.points[0].y + this.getHeight()) + '"></line>';
  }

  drawRectangle(): void {
    const choosedOption = this.chosenOption;
    this.svg = '<rect transform=" translate(' + this.translate.x + ' ' + this.translate.y +
      ')" fill="' + ((choosedOption !== 'Contour') ? this.primaryColor.RGBAString : 'none') + '" stroke="'
      + ((this.erasingEvidence) ? this.erasingColor.RGBAString : ((this.chosenOption !== 'Plein') ? this.secondaryColor.RGBAString : 'none'))
      + (this.isDotted ? '"stroke-dasharray="4, 4"'  : '')
      + '" stroke-width="' + this.thickness
      + '" x="' + this.points[0].x + '" y="' + this.points[0].y
      + '" width="' + this.getWidth() + '" height="' + this.getHeight() + '"></rect>';
  }

  drawPerimeter(): void {
    const thickness = (this.chosenOption === 'Plein') ? 0 : this.thickness;
    this.perimeter = '<rect stroke="gray" fill="none" stroke-width="2' + (this.isDotted ? '"stroke-dasharray="4, 4"'  : '');
    if (this.chosenOption === 'Plein') {
      this.perimeter += '" x="' + this.points[0].x + '" y="' + this.points[0].y
        + '" height="' + this.getHeight() + '" width="' + this.getWidth() + '"></rect>';
    } else {
      this.perimeter += '" x="' + (this.points[0].x - thickness / 2)
        + '" y="' + (this.points[0].y - thickness / 2);
      this.perimeter += '" height="' + ((this.getHeight() === 0) ? thickness : (this.getHeight() + thickness))
        + '" width="' + ((this.getWidth() === 0) ? thickness : (this.getWidth() + thickness)) + '"></rect>';
    }
  }

  updatePosition(x: number, y: number): void {
    this.translate.x += x;
    this.translate.y += y;
    this.draw();
  }

  updatePositionMouse(mouse: MouseEvent, mouseClick: Point): void {
    this.translate.x = mouse.offsetX - mouseClick.x;
    this.translate.y = mouse.offsetY - mouseClick.y;
    this.draw();
  }

  updateParameters(tool: DrawingTool): void {
    this.thickness = (tool.parameters[0].value) ? tool.parameters[0].value : 1;
    this.chosenOption = (tool.parameters[1].chosenOption) ? tool.parameters[1].chosenOption : '';
  }

  translateAllPoints(): void {
    for (const point of this.points) {
      point.x += this.translate.x;
      point.y += this.translate.y;
    }
    this.translate = {x: 0, y: 0};
  }
}
