import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CanvasConversionService } from 'src/app/services/canvas-conversion.service';
import { ShortcutsManagerService } from 'src/app/services/shortcuts-manager.service';
import { BrushToolService } from 'src/app/services/tools/brush-tool.service';
import { ColorChangerToolService } from 'src/app/services/tools/color-changer-tool.service';
import { SprayToolService } from 'src/app/services/tools/spray-tool.service';
import { EllipseToolService } from 'src/app/services/tools/ellipse-tool.service';
import { EraserToolService } from 'src/app/services/tools/eraser-tool.service';
import { LineToolService } from 'src/app/services/tools/line-tool.service';
import { PencilToolService } from 'src/app/services/tools/pencil-tool.service';
import { PipetteToolService } from 'src/app/services/tools/pipette-tool.service';
import { PolygonToolService } from 'src/app/services/tools/polygon-tool.service';
import { RectangleToolService } from 'src/app/services/tools/rectangle-tool.service';
import { SelectionService } from 'src/app/services/tools/selection/selection.service';
import { ToolInterface } from 'src/app/services/tools/tool-interface';
import { TOOL_INDEX, ToolManagerService } from 'src/app/services/tools/tool-manager.service';

const LEFT_CLICK = 0;

@Component({
  selector: 'app-drawing-page',
  templateUrl: './drawing-page.component.html',
  styleUrls: ['./drawing-page.component.scss']
})
export class DrawingPageComponent implements AfterViewInit {

  @ViewChild('canvasConversion', {static: false})
  private coloredDrawing: ElementRef<SVGElement>;

  private toolMap: Map<string, ToolInterface> = new Map<string, ToolInterface>();

  constructor(private tools: ToolManagerService,
              protected pencil: PencilToolService,
              protected rectangle: RectangleToolService,
              protected brush: BrushToolService,
              protected line: LineToolService,
              private shortcuts: ShortcutsManagerService,
              protected selection: SelectionService,
              protected spray: SprayToolService,
              protected pipette: PipetteToolService,
              protected colorChanger: ColorChangerToolService,
              protected ellipse: EllipseToolService,
              protected polygon: PolygonToolService,
              protected eraser: EraserToolService,
              private canvas: CanvasConversionService
              ) {
              this.toolMap.set('Crayon', pencil)
                          .set('Rectangle', rectangle)
                          .set('Ligne', line)
                          .set('Pinceau', brush)
                          .set('Selection', selection)
                          .set('Aérosol', spray)
                          .set('Pipette', pipette)
                          .set('Applicateur Couleur', colorChanger)
                          .set('Ellipse', ellipse)
                          .set('Polygone', polygon)
                          .set('Efface', eraser);
                }

  ngAfterViewInit(): void {
    this.canvas.coloredDrawing = this.coloredDrawing.nativeElement;
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
    if (mouse.button === LEFT_CLICK && tool && tool.onMousePress) {
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

  getDrawingSurfaceClass(): string {
    return (this.tools.activeTool.ID === TOOL_INDEX.ERASER) ? 'hide-cursor' : '';
  }

}
