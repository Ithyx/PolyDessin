import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { CommandManagerService } from './command/command-manager.service';
import { TransformSvgService } from './command/transform-svg.service';
import { ShortcutsFunctionsService } from './shortcuts-functions.service';
import { Point } from './stockage-svg/draw-element/draw-element';
import { EllipseToolService } from './tools/basic-shape-tool/ellipse-tool.service';
import { RectangleToolService } from './tools/basic-shape-tool/rectangle-tool.service';
import { LineToolService } from './tools/line-tool.service';
import { SelectionService } from './tools/selection/selection.service';
import { TOOL_INDEX, ToolManagerService } from './tools/tool-manager.service';

type FunctionShortcut = (keyboard?: KeyboardEvent ) => void;

const SELECTION_MOVEMENT_PIXEL = 3;
const MOVEMENT_DELAY_MS = 100;
const CONTINUOUS_MOVEMENT = 5;

export const enum DIRECTION {
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
  private releaseKeyList: Map<string, FunctionShortcut > = new Map<string, FunctionShortcut>();
  private counter100ms: number;
  private clearTimeout: number;
  private dialogConfig: MatDialogConfig;
  private transformCommand: TransformSvgService;

  newDrawingEmmiter: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private tools: ToolManagerService,
              private rectangleTool: RectangleToolService,
              private ellipseTool: EllipseToolService,
              private lineTool: LineToolService,
              private commands: CommandManagerService,
              private selection: SelectionService,
              private sanitizer: DomSanitizer,
              public shortcutsFunctions: ShortcutsFunctionsService
              ) {
                this.focusOnInput = false;
                this.counter100ms = 0;
                this.clearTimeout = 0;
                this.dialogConfig = new MatDialogConfig();
                this.dialogConfig.disableClose = true;
                this.dialogConfig.autoFocus = true;
                this.dialogConfig.width = '80%';
                this.shortcutsList.set('1', this.shortcutsFunctions.shortcutKey1.bind(this.shortcutsFunctions))
                                    .set('2', this.shortcutsFunctions.shortcutKey2.bind(this.shortcutsFunctions))
                                    .set('3', this.shortcutsFunctions.shortcutKey3.bind(this.shortcutsFunctions))
                                    .set('a', this.shortcutsFunctions.shortcutKeyA.bind(this.shortcutsFunctions))
                                    .set('b', this.shortcutsFunctions.shortcutKeyB.bind(this.shortcutsFunctions))
                                    .set('c', this.shortcutsFunctions.shortcutKeyC.bind(this.shortcutsFunctions))
                                    .set('d', this.shortcutsFunctions.shortcutKeyD.bind(this.shortcutsFunctions))
                                    .set('e', this.shortcutsFunctions.shortcutKeyE.bind(this.shortcutsFunctions))
                                    .set('i', this.shortcutsFunctions.shortcutKeyI.bind(this.shortcutsFunctions))
                                    .set('l', this.shortcutsFunctions.shortcutKeyL.bind(this.shortcutsFunctions))
                                    .set('w', this.shortcutsFunctions.shortcutKeyW.bind(this.shortcutsFunctions))
                                    .set('v', this.shortcutsFunctions.shortcutKeyV.bind(this.shortcutsFunctions))
                                    .set('r', this.shortcutsFunctions.shortcutKeyR.bind(this.shortcutsFunctions))
                                    .set('s', this.shortcutsFunctions.shortcutKeyS.bind(this.shortcutsFunctions))
                                    .set('x', this.shortcutsFunctions.shortcutKeyX.bind(this.shortcutsFunctions))
                                    .set('z', this.shortcutsFunctions.shortcutKeyZ.bind(this.shortcutsFunctions))
                                    .set('Z', this.shortcutsFunctions.shortcutKeyUpperZ.bind(this.shortcutsFunctions))
                                    .set('Shift', this.shortcutsFunctions.shortcutKeyShift.bind(this.shortcutsFunctions))
                                    .set('o', this.shortcutsFunctions.shortcutKeyO.bind(this.shortcutsFunctions))
                                    .set('Backspace', this.shortcutsFunctions.shortcutKeyBackSpace.bind(this.shortcutsFunctions))
                                    .set('Delete', this.shortcutsFunctions.shortcutKeyDelete.bind(this.shortcutsFunctions))
                                    .set('Escape', this.shortcutsFunctions.shortcutKeyEscape.bind(this.shortcutsFunctions))
                                    .set('g', this.shortcutsFunctions.shortcutKeyG.bind(this.shortcutsFunctions))
                                    .set('+', this.shortcutsFunctions.shortcutKeyPlus.bind(this.shortcutsFunctions))
                                    .set('-', this.shortcutsFunctions.shortcutKeyMinus.bind(this.shortcutsFunctions))
                                    .set('ArrowLeft', this.shortcutsFunctions.shortcutKeyArrowLeft.bind(this.shortcutsFunctions))
                                    .set('ArrowRight', this.shortcutsFunctions.shortcutKeyArrowRight.bind(this.shortcutsFunctions))
                                    .set('ArrowDown', this.shortcutsFunctions.shortcutKeyArrowDown.bind(this.shortcutsFunctions))
                                    .set('ArrowUp', this.shortcutsFunctions.shortcutKeyArrowUp.bind(this.shortcutsFunctions));

                this.releaseKeyList.set('Shift', this.releaseKeyShift.bind(this))
                                    .set('ArrowUp', this.releaseKeyArrowUp.bind(this))
                                    .set('ArrowDown', this.releaseKeyArrowDown.bind(this))
                                    .set('ArrowLeft', this.releaseKeyArrowLeft.bind(this))
                                    .set('ArrowRight', this.releaseKeyArrowRight.bind(this));
              }

  treatInput(keyboard: KeyboardEvent): void {
    if (!this.focusOnInput) {
      if (this.shortcutsList.has(keyboard.key)) {
        keyboard.preventDefault();
        (this.shortcutsList.get(keyboard.key) as FunctionShortcut)(keyboard);
      }
      this.updatePositionTimer();
    }
  }

  updatePositionTimer(): void {
    if (this.selection.selectionBox.box) {
      if (this.counter100ms === 0) {
        this.transformCommand = new TransformSvgService(
          this.selection.selectedElements, this.sanitizer, this.selection.deleteBoundingBox.bind(this.selection)
        );
      }
      if (!this.shortcutsFunctions.arrowKeys[DIRECTION.LEFT] && !this.shortcutsFunctions.arrowKeys[DIRECTION.RIGHT]
          && !this.shortcutsFunctions.arrowKeys[DIRECTION.UP] && !this.shortcutsFunctions.arrowKeys[DIRECTION.DOWN]) {
        window.clearInterval(this.clearTimeout);
        this.counter100ms = 0;
        this.clearTimeout = 0;
        if (this.transformCommand.hasMoved()) {
          this.commands.execute(this.transformCommand);
        }

      } else if (this.clearTimeout === 0) {
        this.translateSelection();
        this.clearTimeout = window.setInterval(this.translateSelection.bind(this), MOVEMENT_DELAY_MS);
      }
    }
  }

  translateSelection(): void {
    const translate: Point = {x: 0 , y: 0};

    if (this.shortcutsFunctions.arrowKeys[DIRECTION.LEFT]) {
      translate.x = -SELECTION_MOVEMENT_PIXEL;
    }
    if (this.shortcutsFunctions.arrowKeys[DIRECTION.RIGHT]) {
      translate.x = SELECTION_MOVEMENT_PIXEL;
    }
    if (this.shortcutsFunctions.arrowKeys[DIRECTION.UP]) {
      translate.y = -SELECTION_MOVEMENT_PIXEL;
    }
    if (this.shortcutsFunctions.arrowKeys[DIRECTION.DOWN]) {
      translate.y = SELECTION_MOVEMENT_PIXEL;
    }
    this.counter100ms++;
    if (this.counter100ms >= CONTINUOUS_MOVEMENT || this.counter100ms <= 1) {
      this.selection.updateTranslation(translate.x , translate.y);
    }
  }

  // Release Key functions

  releaseKeyShift(): void {
    if (this.tools.activeTool.ID === TOOL_INDEX.RECTANGLE) {
      this.rectangleTool.shiftRelease();
    }
    if (this.tools.activeTool.ID === TOOL_INDEX.LINE) {
      this.lineTool.shiftRelease();
    }
    if (this.tools.activeTool.ID === TOOL_INDEX.ELLIPSE) {
      this.ellipseTool.shiftRelease();
    }
  }

  releaseKeyArrowLeft(): void {
    this.shortcutsFunctions.arrowKeys[DIRECTION.LEFT] = false;
  }

  releaseKeyArrowRight(): void {
    this.shortcutsFunctions.arrowKeys[DIRECTION.RIGHT] = false;
  }

  releaseKeyArrowUp(): void {
    this.shortcutsFunctions.arrowKeys[DIRECTION.UP] = false;
  }

  releaseKeyArrowDown(): void {
    this.shortcutsFunctions.arrowKeys[DIRECTION.DOWN] = false;
  }

  treatReleaseKey(keyboard: KeyboardEvent): void {
    if (this.releaseKeyList.has(keyboard.key)) {
      keyboard.preventDefault();
      (this.releaseKeyList.get(keyboard.key) as FunctionShortcut)(keyboard);
      this.updatePositionTimer();
    }
  }
}
