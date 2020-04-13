import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { ExportWindowComponent } from '../components/export-window/export-window.component';
import { GalleryComponent } from '../components/gallery/gallery.component';
import { SavePopupComponent } from '../components/save-popup/save-popup.component';
import { ClipboardService } from './clipboard.service';
import { CommandManagerService } from './command/command-manager.service';
import { GridService } from './grid/grid.service';
import { DIRECTION } from './shortcuts-manager.service';
import { SVGStockageService } from './stockage-svg/svg-stockage.service';
import { EllipseToolService } from './tools/basic-shape-tool/ellipse-tool.service';
import { RectangleToolService } from './tools/basic-shape-tool/rectangle-tool.service';
import { EraserToolService } from './tools/eraser-tool.service';
import { LineToolService } from './tools/line-tool.service';
import { SelectionService } from './tools/selection/selection.service';
import { TOOL_INDEX, ToolManagerService } from './tools/tool-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ShortcutsFunctionsService {
  focusOnInput: boolean;
  private dialogConfig: MatDialogConfig;
  private arrowKeys: [boolean, boolean, boolean, boolean];
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
              private eraser: EraserToolService,
              private clipboard: ClipboardService
  ) { this.focusOnInput = false;
      this.dialogConfig = new MatDialogConfig();
      this.dialogConfig.disableClose = true;
      this.dialogConfig.autoFocus = true;
      this.dialogConfig.width = '80%';
      this.arrowKeys = [false, false, false, false];
    }

  clearOngoingSVG(): void {
    this.selection.deleteBoundingBox();
    this.rectangleTool.clear();
    this.lineTool.clear();
    this.eraser.clear();
  }

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

  shortcutKeyB(): void {
    this.tools.changeActiveTool(TOOL_INDEX.PAINT_BUCKET);
    this.clearOngoingSVG();
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
    }
  }

  shortcutKeyDelete(): void {
    if (this.tools.activeTool.ID === TOOL_INDEX.SELECTION && this.selection.selectionBox.box) {
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

  enableShortcuts(): void {
    this.focusOnInput = false;
  }
}
