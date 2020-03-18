import { Injectable } from '@angular/core';
import { Color } from '../stockage-svg/draw-element';

const INIT_OPACITY = 100;

@Injectable({
  providedIn: 'root'
})
export class ColorParameterService {
  lastColors: string[];

  primaryColor: string;
  secondaryColor: string;

  primaryOpacity: number;
  secondaryOpacity: number;
  primaryOpacityDisplayed: number;
  secondaryOpacityDisplayed: number;

  temporaryBackgroundColor: string;

  constructor() {
    this.lastColors = [];
    this.primaryColor = 'rgba(0, 0, 0, ';
    this.secondaryColor = 'rgba(0, 0, 0, ';
    this.primaryOpacity = 1;
    this.secondaryOpacity = 1;
    this.primaryOpacityDisplayed = INIT_OPACITY;
    this.secondaryOpacityDisplayed = INIT_OPACITY;
    this.temporaryBackgroundColor = 'rgba(255, 255, 255, 1)';
  }

  intervertColors(): void {
    const copy = this.primaryColor;
    this.primaryColor = this.secondaryColor;
    this.secondaryColor = copy;
  }

  getPrimaryColor(): Color {
    const color: Color = {
      RGBAString: this.primaryColor + this.primaryOpacity + ')',
      RGBA: [0, 0, 0, 0]
    };
    return color;
  }

  getSecondaryColor(): Color {
    const color: Color = {
      RGBAString: this.secondaryColor + this.secondaryOpacity + ')',
      RGBA: [0, 0, 0, 0]
    };
    return color;
  }
}
