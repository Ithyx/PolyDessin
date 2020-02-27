import { Component, HostListener } from '@angular/core';
import { ShortcutsManagerService } from 'src/app/services/shortcuts-manager.service';
import { BrushToolService } from 'src/app/services/tools/brush-tool.service';
import { DrawSprayService } from 'src/app/services/tools/draw-spray.service';
import { LineToolService } from 'src/app/services/tools/line-tool.service';
import { DrawingToolService } from 'src/app/services/tools/pencil-tool.service';
import { RectangleToolService } from 'src/app/services/tools/rectangle-tool.service'
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
              public spray: DrawSprayService  ) {
    this.toolMap.set('Crayon', pencil)
                      .set('Rectangle', rectangle)
                      .set('Ligne', line)
                      .set('Pinceau', brush)
                      .set('Selection', selection)
                      .set('Aérosol', spray);

  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    this.shortcuts.treatInput(event);
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    this.shortcuts.treatReleaseKey(event);
  }

  onClick(souris: MouseEvent) {
    const outil = this.toolMap.get(this.tools.activeTool.name);
    if (outil && outil.onMouseClick) {
      outil.onMouseClick(souris);
    }
  }

  onMouseMove(souris: MouseEvent) {
    const outil = this.toolMap.get(this.tools.activeTool.name);
    if (outil && outil.onMouseMove) {
      outil.onMouseMove(souris);
    }
  }

  onMouseDown(souris: MouseEvent) {
    const outil = this.toolMap.get(this.tools.activeTool.name);
    if (outil && outil.onMousePress) {
      outil.onMousePress(souris);
    }
  }

  onMouseUp(souris: MouseEvent) {
    const outil = this.toolMap.get(this.tools.activeTool.name);
    if (outil && outil.onMouseRelease) {
      outil.onMouseRelease(souris);
    }
  }

  onMouseLeave(souris: MouseEvent) {
    const outil = this.toolMap.get(this.tools.activeTool.name);
    if (outil && outil.onMouseLeave) {
      outil.onMouseLeave(souris);
    }
  }

  onMouseEnter(souris: MouseEvent) {
    const outil = this.toolMap.get(this.tools.activeTool.name);
    if (outil && outil.onMouseEnter) {
      outil.onMouseEnter(souris);
    }
  }

  onDblClick(souris: MouseEvent) {
    const outil = this.toolMap.get(this.tools.activeTool.name);
    if (outil && outil.onDoubleClick) {
      outil.onDoubleClick(souris);
    }
  }

}
