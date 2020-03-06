import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommandManagerService } from './command/command-manager.service';
import { GridService } from './grid/grid.service';
import { SVGStockageService } from './stockage-svg/svg-stockage.service';
import { LineToolService, Point } from './tools/line-tool.service';
import { RectangleToolService } from './tools/rectangle-tool.service';
import { SelectionService } from './tools/selection/selection.service';
import { TOOL_INDEX, ToolManagerService } from './tools/tool-manager.service';

type FunctionShortcut = (keyboard?: KeyboardEvent ) => void;

const SELECTION_MOVEMENT_PIXEL = 3;

@Injectable({
  providedIn: 'root'
})

export class ShortcutsManagerService {
  focusOnInput: boolean;
  shortcutManager: Map<string, FunctionShortcut > = new Map<string, FunctionShortcut>();
  counter100ms: number;
  clearTimeout: number;

  leftArrow: boolean;
  rightArrow: boolean;
  upArrow: boolean;
  downArrow: boolean;

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
                this.counter100ms = 0;
                this.clearTimeout = 0;
                this.leftArrow = false;
                this.rightArrow = false;
                this.upArrow = false;
                this.downArrow = false;
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
                                    .set('ArrowUp', this.shortcutKeyArrowUp.bind(this));
              }

  updatePositionTimer(): void {
    if (this.selection.selectionBox.selectionBox) {
      if (!this.leftArrow && !this.rightArrow && !this.upArrow && !this.downArrow) {
        window.clearInterval(this.clearTimeout);
        this.counter100ms = 0;
        this.clearTimeout = 0;
        for (const element of this.SVGStockage.getCompleteSVG()) {
          if (element.isSelected) {
            element.translateAllPoints();
          }
        }
      } else if (this.clearTimeout === 0) {
        this.clearTimeout = window.setInterval(() => {
          const translate: Point = {x: 0 , y: 0};

          if (this.leftArrow) {
            translate.x = -SELECTION_MOVEMENT_PIXEL;
          }

          if (this.rightArrow) {
            translate.x = SELECTION_MOVEMENT_PIXEL;
          }

          if (this.upArrow) {
            translate.y = -SELECTION_MOVEMENT_PIXEL;
          }

          if (this.downArrow) {
            translate.y = SELECTION_MOVEMENT_PIXEL;
          }

          this.counter100ms++;
          if (this.counter100ms > 5) {
              this.selection.updatePosition(translate.x , translate.y);
          }
        }, 100);
      }
    }
  }

  treatInput(keyboard: KeyboardEvent): void {
    if (this.focusOnInput) { return; }
    if (this.shortcutManager.has(keyboard.key)) {
      (this.shortcutManager.get(keyboard.key) as FunctionShortcut)(keyboard);
    }
    this.updatePositionTimer();
  }

  clearOngoingSVG(): void {
    this.selection.deleteBoundingBox();
    this.rectangleTool.clear();
    this.lineTool.clear();
  }

  // SHORTCUT FUNCTIONS

  shortcutKey1(): void {
    this.tools.changeActiveTool(TOOL_INDEX.RECTANGLE);
    this.clearOngoingSVG();
  }

  shortcutKeyA(keyboard: KeyboardEvent): void {
    if (keyboard.ctrlKey) {
      this.selection.deleteBoundingBox();
      keyboard.preventDefault();
      this.tools.changeActiveTool(TOOL_INDEX.SELECTION);
      if (this.SVGStockage.getCompleteSVG().length !== 0) {
        for (const element of this.SVGStockage.getCompleteSVG()) {
          element.isSelected = true;
          this.selection.selectedElements.push(element);
        }
        this.selection.createBoundingBox();
      }
    } else { this.tools.changeActiveTool(TOOL_INDEX.SPRAY); }

  }

  shortcutKeyC(): void {
    this.tools.changeActiveTool(TOOL_INDEX.PENCIL);
    this.clearOngoingSVG();
  }

  shortcutKeyL(): void {
    this.tools.changeActiveTool(TOOL_INDEX.LINE);
    this.clearOngoingSVG();
  }

  shortcutKeyW(): void {
      this.tools.changeActiveTool(TOOL_INDEX.BRUSH);
      this.clearOngoingSVG();
  }

  shortcutKeyS(): void {
    this.tools.changeActiveTool(TOOL_INDEX.SELECTION);
    this.clearOngoingSVG();
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
    this.leftArrow = true;
  }

  shortcutKeyArrowRight(): void {
    this.rightArrow = true;
  }

  shortcutKeyArrowUp(): void {
    this.upArrow = true;
  }

  shortcutKeyArrowDown(): void {
    this.downArrow = true;
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

      case 'ArrowLeft':
        this.leftArrow = false;
        break;

      case 'ArrowRight':
        this.rightArrow = false;
        break;

      case 'ArrowDown':
        this.downArrow = false;
        break;

      case 'ArrowUp':
        this.upArrow = false;
        break;

      default:
        break;
    }
    this.updatePositionTimer();
  }
}
