import { Injectable } from '@angular/core';
import { RectangleService } from '../../stockage-svg/rectangle.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionBoxService {

  selectionBox = new RectangleService();

  constructor() { }

  
}
