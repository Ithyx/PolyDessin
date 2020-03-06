import { Component, HostListener } from '@angular/core';
import { ShortcutsManagerService } from 'src/app/services/shortcuts-manager.service';
import { BrushToolService } from 'src/app/services/tools/brush-tool.service';
import { DrawSprayService } from 'src/app/services/tools/draw-spray.service';
import { EllipseToolService } from 'src/app/services/tools/ellipse-tool.service';
import { LineToolService } from 'src/app/services/tools/line-tool.service';
import { DrawingToolService } from 'src/app/services/tools/pencil-tool.service';
import { PipetteToolService } from 'src/app/services/tools/pipette-tool.service';
import { PolygonToolService } from 'src/app/services/tools/polygon-tool.service';
import { RectangleToolService } from 'src/app/services/tools/rectangle-tool.service';
import { SelectionService } from 'src/app/services/tools/selection/selection.service';
import { ToolInterface } from 'src/app/services/tools/tool-interface';
import { ToolManagerService } from 'src/app/services/tools/tool-manager.service';

@Component({
  selector: 'app-drawing-page',
  templateUrl: './drawing-page.component.html',
  styleUrls: ['./drawing-page.component.scss']
})
export class DrawingPageComponent {

  toolMap: Map<string, ToolInterface> = new Map<string, ToolInterface>();

  constructor(
              public tools: ToolManagerService,
              public pencil: DrawingToolService,
              public rectangle: RectangleToolService,
              public brush: BrushToolService,
              public line: LineToolService,
              public shortcuts: ShortcutsManagerService,
              public selection: SelectionService,
              public spray: DrawSprayService,
              public pipette: PipetteToolService,
              public ellipse: EllipseToolService,
              public polygon: PolygonToolService
              ) {
              this.toolMap.set('Crayon', pencil)
                          .set('Rectangle', rectangle)
                          .set('Ligne', line)
                          .set('Pinceau', brush)
                          .set('Selection', selection)
                          .set('Aérosol', spray)
                          .set('Pipette', pipette)
                          .set('Ellipse', ellipse)
                          .set('Polygone', polygon);
                }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    this.shortcuts.treatInput(event);
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    this.shortcuts.treatReleaseKey(event);
  }

  onClick(mouse: MouseEvent): void {
    const tool = this.toolMap.get(this.tools.activeTool.name);
    if (tool && tool.onMouseClick) {
      tool.onMouseClick(mouse);
      mouse.preventDefault();
    }
  }

  onMouseMove(mouse: MouseEvent): void {
    const tool = this.toolMap.get(this.tools.activeTool.name);
    if (tool && tool.onMouseMove) {
      tool.onMouseMove(mouse);
      mouse.preventDefault();
    }
  }

  onMouseDown(mouse: MouseEvent): void {
    const tool = this.toolMap.get(this.tools.activeTool.name);
    if (tool && tool.onMousePress) {
      tool.onMousePress(mouse);
      mouse.preventDefault();
    }
  }

  onMouseUp(mouse: MouseEvent): void {
    const tool = this.toolMap.get(this.tools.activeTool.name);
    if (tool && tool.onMouseRelease) {
      tool.onMouseRelease(mouse);
      mouse.preventDefault();
    }
  }

  onMouseLeave(mouse: MouseEvent): void {
    const tool = this.toolMap.get(this.tools.activeTool.name);
    if (tool && tool.onMouseLeave) {
      tool.onMouseLeave(mouse);
      mouse.preventDefault();
    }
  }

  onMouseEnter(mouse: MouseEvent): void {
    const tool = this.toolMap.get(this.tools.activeTool.name);
    if (tool && tool.onMouseEnter) {
      tool.onMouseEnter(mouse);
      mouse.preventDefault();
    }
  }

  onDblClick(mouse: MouseEvent): void {
    const tool = this.toolMap.get(this.tools.activeTool.name);
    if (tool && tool.onDoubleClick) {
      tool.onDoubleClick(mouse);
      mouse.preventDefault();
    }
  }

  onRightClick(mouse: MouseEvent): void {
    const tool = this.toolMap.get(this.tools.activeTool.name);
    if (tool && tool.onRightClick) {
      tool.onRightClick(mouse);
      mouse.preventDefault();
    }
  }

}
