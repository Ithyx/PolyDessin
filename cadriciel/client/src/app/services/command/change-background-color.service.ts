import { Injectable } from '@angular/core';
import { ColorParameterService } from '../color/color-parameter.service';
import { Command } from './command';

@Injectable({
  providedIn: 'root'
})
export class ChangeBackgroundColorService implements Command {
  oldColor: string;

  constructor(public color: ColorParameterService,
              public newColor: string) {
    this.oldColor = color.backgroundColor;
    color.backgroundColor = newColor;
  }

  undo(): void {
    this.color.backgroundColor = this.oldColor;
  }

  redo(): void {
    this.color.backgroundColor = this.newColor;
  }
}
