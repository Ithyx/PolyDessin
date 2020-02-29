import { Injectable } from '@angular/core';

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

  backgroundColor: string;

  constructor() {
    this.lastColors = [];
    this.primaryColor = 'rgba(0, 0, 0, ';
    this.secondaryColor = 'rgba(0, 0, 0, ';
    this.primaryOpacity = 1;
    this.secondaryOpacity = 1;
    this.primaryOpacityDisplayed = INIT_OPACITY;
    this.secondaryOpacityDisplayed = INIT_OPACITY;
    this.backgroundColor = 'rgba(255, 255, 255, 1)';
  }

  intervertColors(): void {
    const copy = this.primaryColor;
    this.primaryColor = this.secondaryColor;
    this.secondaryColor = copy;
  }

  getPrimaryColor(): string {
    return this.primaryColor + this.primaryOpacity + ')';
  }

  getSecondaryColor(): string {
    return this.secondaryColor + this.secondaryOpacity + ')';
  }
}
