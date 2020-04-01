import { Injectable } from '@angular/core';
import { A, B, Color, G, R,  } from '../stockage-svg/draw-element';

const INIT_OPACITY = 100;
const RGB_MAX = 255;

@Injectable({
  providedIn: 'root'
})

export class ColorParameterService {
  lastColors: Color[];

  primaryColor: Color;
  secondaryColor: Color;

  primaryOpacityDisplayed: number;
  secondaryOpacityDisplayed: number;

  temporaryBackgroundColor: Color;

  constructor() {
    this.lastColors = [];
    this.primaryColor = {
      RGBAString: 'rgba(0, 0, 0, 1)',
      RGBA: [0, 0, 0, 1]
    };
    this.secondaryColor = {
      RGBAString: 'rgba(0, 0, 0, 1)',
      RGBA: [0, 0, 0, 1]
    };
    this.primaryOpacityDisplayed = INIT_OPACITY;
    this.secondaryOpacityDisplayed = INIT_OPACITY;
    this.temporaryBackgroundColor = {
      RGBAString: 'rgba(255, 255, 255, 1)',
      RGBA: [RGB_MAX, RGB_MAX, RGB_MAX, 1]
    };
  }

  intervertColors(): void {
    const oldPrimaryColor = {...this.primaryColor};
    this.primaryColor = {...this.secondaryColor};
    this.secondaryColor = oldPrimaryColor;
    const oldPrimaryOpacity = this.primaryOpacityDisplayed;
    this.primaryOpacityDisplayed = this.secondaryOpacityDisplayed;
    this.secondaryOpacityDisplayed = oldPrimaryOpacity;
  }

  updateColors(): void {
    this.primaryColor.RGBAString = `rgba(${this.primaryColor.RGBA[R]}, ${this.primaryColor.RGBA[G]},
      ${this.primaryColor.RGBA[B]}, ${this.primaryColor.RGBA[A]})`;

    this.secondaryColor.RGBAString = `rgba(${this.secondaryColor.RGBA[R]}, ${this.secondaryColor.RGBA[G]},
      ${this.secondaryColor.RGBA[B]}, ${this.secondaryColor.RGBA[A]})`;
  }
}
