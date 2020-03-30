/*Component de couleur inspire de https://malcoded.com/posts/angular-color-picker/*/

import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { ColorManagerService } from 'src/app/services/color/color-manager.service';
import { A } from 'src/app/services/stockage-svg/draw-element';
import { ToolInterface } from 'src/app/services/tools/tool-interface';

enum GRADIENT_POSITION {
  FIRST = 0,
  SECOND = 0.17,
  THIRD = 0.34,
  FOURTH = 0.51,
  FIFTH = 0.68,
  SIXTH = 0.85,
  SEVENTH = 1
}

enum GRADIENT_POSITION_COLOR {
  FIRST = 'rgba(255, 0, 0, 1)',
  SECOND = 'rgba(255, 255, 0, 1)',
  THIRD = 'rgba(0, 255, 0, 1)',
  FOURTH = 'rgba(0, 255, 255, 1)',
  FIFTH = 'rgba(0, 0, 255, 1)',
  SIXTH = 'rgba(255, 0, 255, 1)',
  SEVENTH = 'rgba(255, 0, 0, 1)'
}

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
    gradient.addColorStop(GRADIENT_POSITION.FIRST, GRADIENT_POSITION_COLOR.FIRST);
    gradient.addColorStop(GRADIENT_POSITION.SECOND, GRADIENT_POSITION_COLOR.SECOND);
    gradient.addColorStop(GRADIENT_POSITION.THIRD, GRADIENT_POSITION_COLOR.THIRD);
    gradient.addColorStop(GRADIENT_POSITION.FOURTH, GRADIENT_POSITION_COLOR.FOURTH);
    gradient.addColorStop(GRADIENT_POSITION.FIFTH, GRADIENT_POSITION_COLOR.FIFTH);
    gradient.addColorStop(GRADIENT_POSITION.SIXTH, GRADIENT_POSITION_COLOR.SIXTH);
    gradient.addColorStop(GRADIENT_POSITION.SEVENTH, GRADIENT_POSITION_COLOR.SEVENTH);

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
    this.colorPosition(evt.offsetX, evt.offsetY);
  }

  onMouseMove(evt: MouseEvent): void {
    if (this.mouseDown) {
      this.chosenHeight = evt.offsetY;
      this.draw();
      this.colorPosition(evt.offsetX, evt.offsetY);
    }
  }

  colorPosition(x: number, y: number): void {
    const imageData = this.context2D.getImageData(x, y, 1, 1).data;

    this.colorManager.color.RGBA = [imageData[0], imageData[1], imageData[2], this.colorManager.color.RGBA[A]];
    this.colorManager.updateColor();
    this.colorManager.hue = this.colorManager.color.RGBAString;
  }

}
