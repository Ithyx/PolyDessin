import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RectangleService } from '../../stockage-svg/rectangle.service';
import { Point } from '../line-tool.service';
import { ToolManagerService} from '../tool-manager.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionBoxService {

  selectionBox: RectangleService;

  constructor(public tools: ToolManagerService,
              private sanitizer: DomSanitizer) { }

  createSelectionBox(pointMin: Point, pointMax: Point): void {

    this.selectionBox = new RectangleService();

    this.selectionBox.isSelected = true;
    this.selectionBox.tool = this.tools.activeTool;

    this.selectionBox.points[0] = pointMin;
    this.selectionBox.points[1] = pointMax;
    this.selectionBox.secondaryColor =  'rgba(0, 80, 150, 1)';

    this.selectionBox.drawRectangle();
    this.selectionBox.SVGHtml = this.sanitizer.bypassSecurityTrustHtml(this.selectionBox.SVG);
  }

  deleteSelectionBox(): void {
    delete this.selectionBox;
  }
}
