/*Component de couleur inspire de https://malcoded.com/posts/angular-color-picker/*/

import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { ColorManagerService } from 'src/app/services/color/color-manager.service';
import { A } from 'src/app/services/stockage-svg/draw-element';
import { ToolInterface } from 'src/app/services/tools/tool-interface';

const FIRT_GRADIENT_POSITION    = 0;
const SECOND_GRADIENT_POSITION  = 0.17;
const THIRD_GRADIENT_POSITION   = 0.34;
const FOURTH_GRADIENT_POSITION  = 0.51;
const FIFTH_GRADIENT_POSITION   = 0.68;
const SIXTH_GRADIENT_POSITION   = 0.85;
const SEVENT_GRADIENT_POSITION  = 1;

const FIRST_GRADIENT_POSITION_COLOR   = 'rgba(255, 0, 0, 1)';
const SECOND_GRADIENT_POSITION_COLOR  = 'rgba(255, 255, 0, 1)';
const THIRD_GRADIENT_POSITION_COLOR   = 'rgba(0, 255, 0, 1)';
const FOURTH_GRADIENT_POSITION_COLOR  = 'rgba(0, 255, 255, 1)';
const FIFTH_GRADIENT_POSITION_COLOR   = 'rgba(0, 0, 255, 1)';
const SIXTH_GRADIENT_POSITION_COLOR   = 'rgba(255, 0, 255, 1)';
const SEVENTH_GRADIENT_POSITION_COLOR = 'rgba(255, 0, 0, 1)';

const CONTEXT_2D_STROKE_STYLE = 'white';
const CONTEXT_2D_LINE_WIDTH = 5;
const CONTEXT_2D_RECT_HEIGHT = 10;
const CONTEXT_2D_RECT_Y = 5;

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.scss']
})

export class ColorSliderComponent implements AfterViewInit, ToolInterface {
  @ViewChild('canvas', {static: true})
  private canvas: ElementRef<HTMLCanvasElement>;

  @Input() private colorManager: ColorManagerService;

  private context2D: CanvasRenderingContext2D ;
  private mouseDown: boolean;
  private chosenHeight: number;

  constructor() {
    this.mouseDown =  false;
  }

  ngAfterViewInit(): void {
    this.draw();
  }

  draw(): void {

    if (!this.context2D) {
      this.context2D = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }
    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;

    this.context2D.clearRect(0, 0, width, height);

    const gradient = this.context2D.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(FIRT_GRADIENT_POSITION  , FIRST_GRADIENT_POSITION_COLOR);
    gradient.addColorStop(SECOND_GRADIENT_POSITION, SECOND_GRADIENT_POSITION_COLOR);
    gradient.addColorStop(THIRD_GRADIENT_POSITION , THIRD_GRADIENT_POSITION_COLOR);
    gradient.addColorStop(FOURTH_GRADIENT_POSITION, FOURTH_GRADIENT_POSITION_COLOR);
    gradient.addColorStop(FIFTH_GRADIENT_POSITION , FIFTH_GRADIENT_POSITION_COLOR);
    gradient.addColorStop(SIXTH_GRADIENT_POSITION , SIXTH_GRADIENT_POSITION_COLOR);
    gradient.addColorStop(SEVENT_GRADIENT_POSITION, SEVENTH_GRADIENT_POSITION_COLOR);

    this.context2D.beginPath();
    this.context2D.rect(0, 0, width, height);

    this.context2D.fillStyle = gradient;
    this.context2D.fill();
    this.context2D.closePath();

    if (this.chosenHeight) {
      this.context2D.beginPath();
      this.context2D.strokeStyle = CONTEXT_2D_STROKE_STYLE;
      this.context2D.lineWidth = CONTEXT_2D_LINE_WIDTH;
      this.context2D.rect(0, this.chosenHeight - CONTEXT_2D_RECT_Y, width, CONTEXT_2D_RECT_HEIGHT);
      this.context2D.stroke();
      this.context2D.closePath();
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseRelease(): void {
    this.mouseDown = false;
  }

  onMousePress(evt: MouseEvent): void {
    this.mouseDown = true;
    this.chosenHeight = evt.offsetY;
    this.draw();
    this.emittedColor(evt.offsetX, evt.offsetY);
  }

  onMouseMove(evt: MouseEvent): void {
    if (this.mouseDown) {
      this.chosenHeight = evt.offsetY;
      this.draw();
      this.emittedColor(evt.offsetX, evt.offsetY);
    }
  }

  emittedColor(x: number, y: number): void {
    this.colorPosition(x, y);
  }

  colorPosition(x: number, y: number): void {
    const imageData = this.context2D.getImageData(x, y, 1, 1).data;

    this.colorManager.color.RGBA = [imageData[0], imageData[1], imageData[2], this.colorManager.color.RGBA[A]];
    this.colorManager.updateColor();
    this.colorManager.hue = this.colorManager.color.RGBAString;
  }

}
