import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { ExportWindowComponent } from '../components/export-window/export-window.component';
import { GalleryComponent } from '../components/gallery/gallery.component';
import { SavePopupComponent } from '../components/save-popup/save-popup.component';
import { CommandManagerService } from './command/command-manager.service';
import { TranslateSvgService } from './command/translate-svg.service';
import { GridService } from './grid/grid.service';
import { Point } from './stockage-svg/draw-element/draw-element';
import { SVGStockageService } from './stockage-svg/svg-stockage.service';
import { EllipseToolService } from './tools/basic-shape-tool/ellipse-tool.service';
import { RectangleToolService } from './tools/basic-shape-tool/rectangle-tool.service';
import { EraserToolService } from './tools/eraser-tool.service';
import { LineToolService } from './tools/line-tool.service';
import { SelectionService } from './tools/selection/selection.service';
import { TOOL_INDEX, ToolManagerService } from './tools/tool-manager.service';
import { ClipboardService } from './clipboard.service';

type FunctionShortcut = (keyboard?: KeyboardEvent ) => void;

const SELECTION_MOVEMENT_PIXEL = 3;
const MOVEMENT_DELAY_MS = 100;
const CONTINUOUS_MOVEMENT = 5;

const enum DIRECTION {
  LEFT = 0,
  RIGHT = 1,
  UP = 2,
  DOWN = 3
}

@Injectable({
  providedIn: 'root'
})

export class ShortcutsManagerService {
  focusOnInput: boolean;
  private shortcutsList: Map<string, FunctionShortcut > = new Map<string, FunctionShortcut>();
  private counter100ms: number;
  private clearTimeout: number;
  private arrowKeys: [boolean, boolean, boolean, boolean];
  private dialogConfig: MatDialogConfig;

  newDrawingEmmiter: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private tools: ToolManagerService,
              private rectangleTool: RectangleToolService,
              private ellipseTool: EllipseToolService,
              private lineTool: LineToolService,
              private commands: CommandManagerService,
              private selection: SelectionService,
              private svgStockage: SVGStockageService,
              private grid: GridService,
              private dialog: MatDialog,
              private sanitizer: DomSanitizer,
              private eraser: EraserToolService,
              private clipboard: ClipboardService
              ) {
                this.focusOnInput = false;
                this.counter100ms = 0;
                this.clearTimeout = 0;
                this.arrowKeys = [false, false, false, false];
                this.dialogConfig = new MatDialogConfig();
                this.dialogConfig.disableClose = true;
                this.dialogConfig.autoFocus = true;
                this.dialogConfig.width = '80%';
                this.shortcutsList.set('1', this.shortcutKey1.bind(this))
                                    .set('2', this.shortcutKey2.bind(this))
                                    .set('3', this.shortcutKey3.bind(this))
                                    .set('a', this.shortcutKeyA.bind(this))
                                    .set('c', this.shortcutKeyC.bind(this))
                                    .set('d', this.shortcutKeyD.bind(this))
                                    .set('e', this.shortcutKeyE.bind(this))
                                    .set('i', this.shortcutKeyI.bind(this))
                                    .set('l', this.shortcutKeyL.bind(this))
                                    .set('w', this.shortcutKeyW.bind(this))
                                    .set('v', this.shortcutKeyV.bind(this))
                                    .set('r', this.shortcutKeyR.bind(this))
                                    .set('s', this.shortcutKeyS.bind(this))
                                    .set('x', this.shortcutKeyX.bind(this))
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
    if (this.selection.selectionBox.box) {
      if (!this.arrowKeys[DIRECTION.LEFT] && !this.arrowKeys[DIRECTION.RIGHT]
          && !this.arrowKeys[DIRECTION.UP] && !this.arrowKeys[DIRECTION.DOWN]) {
        window.clearInterval(this.clearTimeout);
        this.counter100ms = 0;
        this.clearTimeout = 0;
        if (this.selection.hasMoved()) {
          this.commands.execute(new TranslateSvgService(
            this.selection.selectedElements,
            this.selection.selectionBox,
            this.sanitizer,
            this.selection.deleteBoundingBox));
        }

      } else if (this.clearTimeout === 0) {
        this.translateSelection();
        this.clearTimeout = window.setInterval(this.translateSelection.bind(this), MOVEMENT_DELAY_MS);
      }
    }
  }

  translateSelection(): void {
    const translate: Point = {x: 0 , y: 0};

    if (this.arrowKeys[DIRECTION.LEFT]) {
      translate.x = -SELECTION_MOVEMENT_PIXEL;
    }
    if (this.arrowKeys[DIRECTION.RIGHT]) {
      translate.x = SELECTION_MOVEMENT_PIXEL;
    }
    if (this.arrowKeys[DIRECTION.UP]) {
      translate.y = -SELECTION_MOVEMENT_PIXEL;
    }
    if (this.arrowKeys[DIRECTION.DOWN]) {
      translate.y = SELECTION_MOVEMENT_PIXEL;
    }
    this.counter100ms++;
    if (this.counter100ms >= CONTINUOUS_MOVEMENT || this.counter100ms <= 1) {
      this.selection.updatePosition(translate.x , translate.y);
    }
  }

  treatInput(keyboard: KeyboardEvent): void {
    if (this.focusOnInput) { return; }
    if (this.shortcutsList.has(keyboard.key)) {
      keyboard.preventDefault();
      (this.shortcutsList.get(keyboard.key) as FunctionShortcut)(keyboard);
    }
    this.updatePositionTimer();
  }

  enableShortcuts(): void {
    this.focusOnInput = false;
  }

  clearOngoingSVG(): void {
    this.selection.deleteBoundingBox();
    this.rectangleTool.clear();
    this.lineTool.clear();
    this.eraser.clear();
  }

  // SHORTCUT FUNCTIONS

  shortcutKey1(): void {
    this.tools.changeActiveTool(TOOL_INDEX.RECTANGLE);
    this.clearOngoingSVG();
  }

  shortcutKey2(): void {
    this.tools.changeActiveTool(TOOL_INDEX.ELLIPSE);
    this.clearOngoingSVG();
  }

  shortcutKey3(): void {
    this.tools.changeActiveTool(TOOL_INDEX.POLYGON);
    this.clearOngoingSVG();
  }

  shortcutKeyA(keyboard: KeyboardEvent): void {
    if (keyboard.ctrlKey) {
      this.selection.deleteBoundingBox();
      this.tools.changeActiveTool(TOOL_INDEX.SELECTION);
      if (this.svgStockage.getCompleteSVG().length !== 0) {
        for (const element of this.svgStockage.getCompleteSVG()) {
          this.selection.selectedElements.push(element);
        }
        this.selection.createBoundingBox();
      }
    } else { this.tools.changeActiveTool(TOOL_INDEX.SPRAY); }

  }

  shortcutKeyC(keyboard: KeyboardEvent): void {
    if (keyboard.ctrlKey && this.selection.selectionBox.box) {
      this.clipboard.copySelectedElement();
    } else {
      this.tools.changeActiveTool(TOOL_INDEX.PENCIL);
      this.clearOngoingSVG();
    }
  }

  shortcutKeyE(keyboard: KeyboardEvent): void {
    if (keyboard.ctrlKey) {
      this.focusOnInput = true;
      this.selection.deleteBoundingBox();
      this.dialog.open(ExportWindowComponent, this.dialogConfig).afterClosed().subscribe(this.enableShortcuts.bind(this));
    } else {
      this.tools.changeActiveTool(TOOL_INDEX.ERASER);
      this.clearOngoingSVG();
    }
  }

  shortcutKeyI(): void {
    this.tools.changeActiveTool(TOOL_INDEX.PIPETTE);
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

  shortcutKeyR(): void {
    this.tools.changeActiveTool(TOOL_INDEX.COLOR_CHANGER);
    this.clearOngoingSVG();
  }

  shortcutKeyS(keyboard: KeyboardEvent): void {
    if (keyboard.ctrlKey) {
      this.focusOnInput = true;
      this.selection.deleteBoundingBox();
      this.dialog.open(SavePopupComponent, this.dialogConfig).afterClosed().subscribe(this.enableShortcuts.bind(this));
    } else {
      this.tools.changeActiveTool(TOOL_INDEX.SELECTION);
      this.clearOngoingSVG();
    }
  }

  shortcutKeyV(keyboard: KeyboardEvent): void {
    if (keyboard.ctrlKey) {
      this.clipboard.pasteSelectedElement();
    }
  }

  shortcutKeyD(keyboard: KeyboardEvent): void {
    if (keyboard.ctrlKey && this.selection.selectionBox.box) {
      this.clipboard.duplicateSelectedElement();
    }
  }

  shortcutKeyX(keyboard: KeyboardEvent): void {
    if (keyboard.ctrlKey && this.selection.selectionBox.box) {
      this.clipboard.cutSelectedElement();
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
    switch (this.tools.activeTool.ID) {
      case TOOL_INDEX.RECTANGLE:
        this.rectangleTool.shiftPress();
        break;
      case TOOL_INDEX.LINE:
        this.lineTool.shiftPress();
        break;
      case TOOL_INDEX.ELLIPSE:
        this.ellipseTool.shiftPress();
        break;
    }
  }

  shortcutKeyO(keyboard: KeyboardEvent): void {
    if (keyboard.ctrlKey) {
      this.newDrawingEmmiter.next(false);
      this.selection.deleteBoundingBox();
    }
  }

  shortcutKeyBackSpace(): void {
    if (this.tools.activeTool.ID === TOOL_INDEX.LINE) {
      this.lineTool.removePoint();
    } else if (this.tools.activeTool.ID === TOOL_INDEX.SELECTION) {
      this.clipboard.deleteSelectedElement();
    }
  }

  shortcutKeyEscape(): void {
    if (this.tools.activeTool.ID === TOOL_INDEX.LINE) {
      this.lineTool.clear();
    }
  }

  shortcutKeyG(keyboard: KeyboardEvent): void {
    if (keyboard.ctrlKey) {
      this.focusOnInput = true;
      this.selection.deleteBoundingBox();
      this.dialog.open(GalleryComponent, this.dialogConfig).afterClosed().subscribe(this.enableShortcuts.bind(this));
    } else { this.grid.showGrid = !this.grid.showGrid; }
  }

  shortcutKeyPlus(): void {
    this.grid.increaseSize();
  }

  shortcutKeyMinus(): void {
    this.grid.decreaseSize();
  }

  shortcutKeyArrowLeft(): void {
    this.arrowKeys[DIRECTION.LEFT] = true;
  }

  shortcutKeyArrowRight(): void {
    this.arrowKeys[DIRECTION.RIGHT] = true;
  }

  shortcutKeyArrowUp(): void {
    this.arrowKeys[DIRECTION.UP] = true;
  }

  shortcutKeyArrowDown(): void {
    this.arrowKeys[DIRECTION.DOWN] = true;
  }

  treatReleaseKey(keyboard: KeyboardEvent): void {
    switch (keyboard.key) {
      case 'Shift':
        if (this.tools.activeTool.ID === TOOL_INDEX.RECTANGLE) {
          this.rectangleTool.shiftRelease();
        }
        if (this.tools.activeTool.ID === TOOL_INDEX.LINE) {
          this.lineTool.shiftRelease();
        }
        if (this.tools.activeTool.ID === TOOL_INDEX.ELLIPSE) {
          this.ellipseTool.shiftRelease();
        }
        break;

      case 'ArrowLeft':
        this.arrowKeys[DIRECTION.LEFT] = false;
        break;

      case 'ArrowRight':
        this.arrowKeys[DIRECTION.RIGHT] = false;
        break;

      case 'ArrowDown':
        this.arrowKeys[DIRECTION.DOWN] = false;
        break;

      case 'ArrowUp':
        this.arrowKeys[DIRECTION.UP] = false;
        break;

      default:
        break;
    }
    this.updatePositionTimer();
  }
}
