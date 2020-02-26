import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommandManagerService } from './command/command-manager.service';
import { GridService } from './grid/grid.service';
import { LineToolService } from './outils/line-tool.service';
import { RectangleToolService } from './outils/rectangle-tool.service';
import { SelectionService } from './outils/selection/selection.service';
import { BRUSH_TOOL_INDEX,
        LINE_TOOL_INDEX, PENCIL_TOOL_INDEX,
        RECTANGLE_TOOL_INDEX, SELECTION_TOOL_INDEX, SPRAY_TOOL_INDEX, ToolManagerService } from './outils/tool-manager.service';
import { SVGStockageService } from './stockage-svg/svg-stockage.service';

@Injectable({
  providedIn: 'root'
})
export class ShortcutsManagerService {
  focusOnInput = false;

  newDrawingEmmiter: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(public tools: ToolManagerService,
              public rectangleTool: RectangleToolService,
              public lineTool: LineToolService,
              public commands: CommandManagerService,
              public selection: SelectionService,
              public SVGStockage: SVGStockageService,
              public grid: GridService) { }

  clearOngoingSVG() {
    this.rectangleTool.clear();
    this.lineTool.clear();
  }

  treatInput(keybord: KeyboardEvent) {
    if (this.focusOnInput) { return; };
    switch (keybord.key) {
      case '1':
        this.selection.deleteBoundingBox();
        this.tools.changeActiveTool(RECTANGLE_TOOL_INDEX);
        this.clearOngoingSVG();
        break;

      case 'a':
        this.selection.deleteBoundingBox();

        if (keybord.ctrlKey) {
          keybord.preventDefault();
          this.tools.changeActiveTool(SELECTION_TOOL_INDEX);
          this.selection.createBoundingBoxAllStockageSVG(this.SVGStockage.getCompleteSVG());
        } else {this.tools.changeActiveTool(SPRAY_TOOL_INDEX); };
        break;

      case 'c':
        this.selection.deleteBoundingBox();
        this.tools.changeActiveTool(PENCIL_TOOL_INDEX);
        this.clearOngoingSVG();
        break;

      case 'l':
        this.selection.deleteBoundingBox();
        this.tools.changeActiveTool(LINE_TOOL_INDEX);
        this.clearOngoingSVG();
        break;

      case 'w':
        this.selection.deleteBoundingBox();
        this.tools.changeActiveTool(BRUSH_TOOL_INDEX);
        this.clearOngoingSVG();
        break;

      case 's':
        this.selection.deleteBoundingBox();
        this.tools.changeActiveTool(SELECTION_TOOL_INDEX);
        this.clearOngoingSVG();

      case 'z':
        if (keybord.ctrlKey && !this.commands.drawingInProgress) {
          this.commands.cancelCommand();
        }
        break;

      case 'Z':
        if (keybord.ctrlKey && !this.commands.drawingInProgress) {
          this.commands.redoCommand();
        }
        break;

      case 'Shift':
        if (this.tools.activeTool.ID === RECTANGLE_TOOL_INDEX) {
          this.rectangleTool.shiftPress();
        }
        if (this.tools.activeTool.ID === LINE_TOOL_INDEX) {
          this.lineTool.stockerCurseur();
        }
        break;

      case 'o':
        if (keybord.ctrlKey) {
          this.newDrawingEmmiter.next(false);
          this.selection.deleteBoundingBox();
          keybord.preventDefault();
        }
        break;

      case 'Backspace':
        if (this.tools.activeTool.ID === LINE_TOOL_INDEX) {
          this.lineTool.retirerPoint();
        }
        break;

      case 'Escape':
        if (this.tools.activeTool.ID === LINE_TOOL_INDEX) {
          this.lineTool.clear();
        }
        break;

      case 'g':
        this.grid.showGrid = !this.grid.showGrid;
        break;

      case '+':
        this.grid.increaseSize();
        break;

      case '-':
        this.grid.decreaseSize();
        break;

      default:
        break;
    }
  }

  treatReleaseKey(keybord: KeyboardEvent) {
    switch (keybord.key) {
      case 'Shift':
        if (this.tools.activeTool.ID === RECTANGLE_TOOL_INDEX) {
          this.rectangleTool.shiftRelease();
        }
        if (this.tools.activeTool.ID === LINE_TOOL_INDEX) {
          this.lineTool.ShiftRelease();
        }
        break;

      default:
        break;
    }
  }
}
