/*Component de couleur inspire de https://malcoded.com/posts/angular-color-picker/*/

import { AfterViewInit, Component, ElementRef,  HostListener, Input, OnChanges,
         SimpleChanges, ViewChild, } from '@angular/core';
import { ColorManagerService } from 'src/app/services/color/color-manager.service';
import { ToolInterface } from 'src/app/services/tools/tool-interface';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements AfterViewInit, OnChanges, ToolInterface {

  @Input() colorManager: ColorManagerService;

  @ViewChild('canvas' , {static: false} )
  canvas: ElementRef<HTMLCanvasElement>;

  private context2D: CanvasRenderingContext2D;
  private mouseDown: boolean;
  chosenHeight: { x: number; y: number};

  constructor() {
    this.mouseDown = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes[this.colorManager.hue]) {
      this.draw();
      const pos = this.chosenHeight;
      if (pos) {
        this.colorPosition(pos.x, pos.y);
      }
    }
  }

  colorPosition(x: number, y: number): void {
    const imageData = this.context2D.getImageData(x, y, 1, 1).data;
    this.colorManager.color = 'rgba(' + imageData[0] + ',' + imageData[1] + ','
      + imageData[2] + ',';
    this.colorManager.RGB = [imageData[0], imageData[1], imageData[2]];
  }

  emittedColor(x: number, y: number): void {
    this.colorPosition(x, y);
  }

  @HostListener ('window:mouseup', ['$event'] )
    onMouseRelease(evt: MouseEvent): void {
      this.mouseDown = false;
    }

    onMousePress(evt: MouseEvent): void {
      this.mouseDown = true;
      this.chosenHeight = {x: evt.offsetX, y: evt.offsetY};
      this.draw();
      this.colorPosition(evt.offsetX, evt.offsetY);
    }

    onMouseMove(evt: MouseEvent): void {
      if (this.mouseDown) {
        this.chosenHeight = { x: evt.offsetX, y: evt.offsetY};
        this.draw();
        this.emittedColor(evt.offsetX, evt.offsetY);
      }
    }

  ngAfterViewInit(): void {
    this.draw();
  }

  draw(): void {

    this.context2D = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;

    this.context2D.fillStyle = this.colorManager.hue + '1)';
    this.context2D.fillRect(0, 0, width, height);

    const whiteGrad = this.context2D.createLinearGradient(0, 0, width, 0);
    whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
    whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');

    this.context2D.fillStyle = whiteGrad;
    this.context2D.fillRect(0, 0, width, height);

    const blackGrad = this.context2D.createLinearGradient(0, 0, 0, height);
    blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
    blackGrad.addColorStop(1, 'rgba(0,0,0,1)');

    this.context2D.fillStyle = blackGrad;
    this.context2D.fillRect(0, 0, width, height);

    if (this.chosenHeight) {
      this.context2D.strokeStyle = 'white';
      this.context2D.fillStyle = 'white';
      this.context2D.beginPath();
      this.context2D.arc(
        this.chosenHeight.x,
        this.chosenHeight.y,
        10,
        0,
        2 * Math.PI
      );
      this.context2D.lineWidth = 5;
      this.context2D.stroke();
    }
  }
}
