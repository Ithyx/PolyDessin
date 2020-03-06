import { Injectable } from '@angular/core';
import { ToolInterface } from './tool-interface';

@Injectable({
  providedIn: 'root'
})
export class ColorChangerToolService implements ToolInterface {

  constructor() { }
}
