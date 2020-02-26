import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorParameterService {
  lastColors: string[] = [];

  primaryColor = 'rgba(0, 0, 0, ';
  secondaryColor = 'rgba(0, 0, 0, ';

  primaryOpacity = 1;
  secondaryOpacity = 1;
  primaryOpacityDisplayed = 100;
  secondaryOpacityDisplayed = 100;

  backgroundColor = 'rgba(255, 255, 255, 1)'

  intervertColors() {
    const copy = this.primaryColor;
    this.primaryColor = this.secondaryColor;
    this.secondaryColor = copy;
  }

  getPrimaryColor() {
    return this.primaryColor + this.primaryOpacity + ')';
  }

  getSecondaryColor() {
    return this.secondaryColor + this.secondaryOpacity + ')';
  }
}
