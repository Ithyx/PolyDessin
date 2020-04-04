import { Injectable } from '@angular/core';
import { ToolInterface } from './tool-interface';

@Injectable({
  providedIn: 'root'
})
export class PaintBucketToolService implements ToolInterface {

  onMouseClick(mouse: MouseEvent): void {
    return;
  }
}
