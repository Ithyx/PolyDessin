import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommandManagerService } from './command/command-manager.service';
import { DatabaseService } from './database/database.service';
import { GridService } from './grid/grid.service';
import { SVGStockageService } from './stockage-svg/svg-stockage.service';
import { LineToolService } from './tools/line-tool.service';
import { RectangleToolService } from './tools/rectangle-tool.service';
import { SelectionService } from './tools/selection/selection.service';
import { TOOL_INDEX, ToolManagerService } from './tools/tool-manager.service';

type FunctionShortcut = (keyboard?: KeyboardEvent ) => void;

@Injectable({
  providedIn: 'root'
})

export class ShortcutsManagerService {
  focusOnInput: boolean;
  shortcutManager: Map<string, FunctionShortcut > = new Map<string, FunctionShortcut>();

  newDrawingEmmiter: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(public tools: ToolManagerService,
              public rectangleTool: RectangleToolService,
              public lineTool: LineToolService,
              public commands: CommandManagerService,
              public selection: SelectionService,
              public SVGStockage: SVGStockageService,
              public grid: GridService
              ) {
                this.focusOnInput = false;
                this.shortcutManager.set('1', this.shortcutKey1.bind(this))
                                    .set('a', this.shortcutKeyA.bind(this))
                                    .set('c', this.shortcutKeyC.bind(this))
                                    .set('l', this.shortcutKeyL.bind(this))
                                    .set('w', this.shortcutKeyW.bind(this))
                                    .set('s', this.shortcutKeyS.bind(this))
                                    .set('z', this.shortcutKeyZ.bind(this))
                                    .set('Z', this.shortcutKeyUpperZ.bind(this))
                                    .set('Shift', this.shortcutKeyShift.bind(this))
                                    .set('o', this.shortcutKeyO.bind(this))
                                    .set('Backspace', this.shortcutKeyBackSpace.bind(this))
                                    .set('Escape', this.shortcutKeyEscape.bind(this))
                                    .set('g', this.shortcutKeyG.bind(this))
                                    .set('+', this.shortcutKeyPlus.bind(this))
                                    .set('-', this.shortcutKeyMinus.bind(this))
                                    .set('ArrowLeft', this.shortcutKeyArrowLeft.bind(this))
                                    .set('ArrowRight', this.shortcutKeyArrowRight.bind(this))
                                    .set('ArrowDown', this.shortcutKeyArrowDown.bind(this))
                                    .set('ArrowUp', this.shortcutKeyArrowUp.bind(this))
                                    ;
              }

  treatInput(keyboard: KeyboardEvent): void {
    if (this.focusOnInput) { return; }
    (this.shortcutManager.get(keyboard.key) as FunctionShortcut)(keyboard);
  }

  clearOngoingSVG(): void {
    this.rectangleTool.clear();
    this.lineTool.clear();
  }

  // SHORTCUT FUNCTIONS

  shortcutKey1(): void {
    this.selection.deleteBoundingBox();
    this.tools.changeActiveTool(TOOL_INDEX.RECTANGLE);
    this.clearOngoingSVG();
  }

  shortcutKeyA(keyboard: KeyboardEvent): void {
    this.selection.deleteBoundingBox();

    if (keyboard.ctrlKey) {
        keyboard.preventDefault();
        this.tools.changeActiveTool(TOOL_INDEX.SELECTION);
        if (this.SVGStockage.getCompleteSVG().length !== 0) {
          this.selection.selectedElements = this.SVGStockage.getCompleteSVG();
          this.selection.createBoundingBox();
          }
        } else {this.tools.changeActiveTool(TOOL_INDEX.SPRAY); };

  }

  shortcutKeyC(): void {
    this.selection.deleteBoundingBox();
    this.tools.changeActiveTool(TOOL_INDEX.PENCIL);
    this.clearOngoingSVG();
  }

  shortcutKeyL(): void {
  this.selection.deleteBoundingBox();
  this.tools.changeActiveTool(TOOL_INDEX.LINE);
  this.clearOngoingSVG();
  }

  shortcutKeyW(): void {
      this.selection.deleteBoundingBox();
      this.tools.changeActiveTool(TOOL_INDEX.BRUSH);
      this.clearOngoingSVG();
  }

  shortcutKeyS(keyboard: KeyboardEvent): void {
    if (keyboard.ctrlKey) {
      this
      keyboard.preventDefault();
    } else {
      this.selection.deleteBoundingBox();
      this.tools.changeActiveTool(TOOL_INDEX.SELECTION);
      this.clearOngoingSVG();
    }
  }

  shortcutKeyZ(keyboard: KeyboardEvent): void {
    if (keyboard.ctrlKey && !this.commands.drawingInProgress) {
      this.commands.cancelCommand();
    }
  }

  shortcutKeyUpperZ(keyboard: KeyboardEvent): void {
    if (keyboard.ctrlKey && !this.commands.drawingInProgress) {
      this.commands.redoCommand();
    }
  }

  shortcutKeyShift(): void {
    if (this.tools.activeTool.ID === TOOL_INDEX.RECTANGLE) {
      this.rectangleTool.shiftPress();
    } else if (this.tools.activeTool.ID === TOOL_INDEX.LINE) {
      this.lineTool.memorizeCursor();
    }
  }

  shortcutKeyO(keyboard: KeyboardEvent): void {
    if (keyboard.ctrlKey) {
      this.newDrawingEmmiter.next(false);
      this.selection.deleteBoundingBox();
      keyboard.preventDefault();
    }
  }

  shortcutKeyBackSpace(): void {
    if (this.tools.activeTool.ID === TOOL_INDEX.LINE) {
      this.lineTool.removePoint();
    }
  }

  shortcutKeyEscape(): void{
    if (this.tools.activeTool.ID === TOOL_INDEX.LINE) {
      this.lineTool.clear();
    }
  }

  shortcutKeyG(): void {
    this.grid.showGrid = !this.grid.showGrid;
  }

  shortcutKeyPlus(): void {
    this.grid.increaseSize();
  }

  shortcutKeyMinus(): void {
    this.grid.decreaseSize();
  }

  shortcutKeyArrowLeft(): void {
    this.selection.updatePosition(-3, 0);
  }

  shortcutKeyArrowRight(): void {
    this.selection.updatePosition(3, 0);
  }

  shortcutKeyArrowUp(): void {
    this.selection.updatePosition(0, -3);
  }

  shortcutKeyArrowDown(): void {
    this.selection.updatePosition(0, 3);
  }

  treatReleaseKey(keybord: KeyboardEvent): void {
    switch (keybord.key) {
      case 'Shift':
        if (this.tools.activeTool.ID === TOOL_INDEX.RECTANGLE) {
          this.rectangleTool.shiftRelease();
        }
        if (this.tools.activeTool.ID === TOOL_INDEX.LINE) {
          this.lineTool.shiftRelease();
        }
        break;

      default:
        break;
    }
  }
}
