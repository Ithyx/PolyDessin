/*Component de couleur inspire de https://malcoded.com/posts/angular-color-picker/*/

import { AfterViewInit, Component, ElementRef, HostListener, Input,
         ViewChild } from '@angular/core';
import { ColorManagerService } from 'src/app/services/color/color-manager.service';
import { ToolInterface } from 'src/app/services/tools/tool-interface';
import { A } from 'src/app/services/stockage-svg/draw-element';

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.scss']
})

export class ColorSliderComponent implements AfterViewInit, ToolInterface {
  @ViewChild('canvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;
  @Input() colorManager: ColorManagerService;

  private context2D: CanvasRenderingContext2D ;
  private mouseDown: boolean;
  chosenHeight: number;

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
    gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
    gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');

    this.context2D.beginPath();
    this.context2D.rect(0, 0, width, height);

    this.context2D.fillStyle = gradient;
    this.context2D.fill();
    this.context2D.closePath();

    if (this.chosenHeight) {
      this.context2D.beginPath();
      this.context2D.strokeStyle = 'white';
      this.context2D.lineWidth = 5;
      this.context2D.rect(0, this.chosenHeight - 5, width, 10);
      this.context2D.stroke();
      this.context2D.closePath();
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseRelease(evt: MouseEvent): void {
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
