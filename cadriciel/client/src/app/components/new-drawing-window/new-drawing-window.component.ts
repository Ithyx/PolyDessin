import { Component, HostListener, NgZone } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { ColorChoiceComponent } from 'src/app/components/color-choice/color-choice.component';
import { Scope } from 'src/app/services/color/color-manager.service';
import { ColorParameterService } from 'src/app/services/color/color-parameter.service';
import { CommandManagerService } from 'src/app/services/command/command-manager.service';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { LocalSaveManagerService } from 'src/app/services/saving/local/local-save-manager.service';
import { SVGStockageService } from 'src/app/services/stockage-svg/svg-stockage.service';

export const KEY_FORM_HEIGHT = 'formHeight';
export const KEY_FORM_WIDTH = 'formWidth';
export const KEY_FORM_NAME = 'formName';
export const BUFFER_WIDTH = 510;
export const BUFFER_HEIGHT = 15;

@Component({
  selector: 'app-new-drawing-window',
  templateUrl: './new-drawing-window.component.html',
  styleUrls: ['./new-drawing-window.component.scss']
})

export class NewDrawingWindowComponent {
  private windowHeight: number;
  private windowWidth: number;
  private dimensionManuallyChange: boolean;
  private colorWindow: ColorChoiceComponent;
  private newDrawing: FormGroup;

  private heightValid: boolean;
  private widthValid: boolean;

  constructor(private dialogRef: MatDialogRef<NewDrawingWindowComponent>,
              private drawingManager: DrawingManagerService,
              private router: Router,
              private svgStockage: SVGStockageService,
              private dialog: MatDialog,
              private colorParameter: ColorParameterService,
              private commands: CommandManagerService,
              private ngZone: NgZone,
              private localSaving: LocalSaveManagerService ) {
    this.windowHeight = window.innerHeight - BUFFER_HEIGHT;
    this.windowWidth = window.innerWidth - BUFFER_WIDTH;
    this.dimensionManuallyChange = false;

    this.newDrawing = new FormGroup({
      formHeight: new FormControl(this.windowHeight),
      formWidth: new FormControl(this.windowWidth),
    });

    this.heightValid = true;
    this.widthValid = true;

    this.changeWindowDimension();
  }

  areDimensionsValid(): boolean {
    this.heightValid = this.newDrawing.value[KEY_FORM_HEIGHT] > 0;
    this.widthValid = this.newDrawing.value[KEY_FORM_WIDTH] > 0;
    return this.heightValid && this.widthValid;
  }

  closeWindow(): void {
    this.colorParameter.temporaryBackgroundColor = this.drawingManager.backgroundColor;
    this.dialogRef.close();
  }

  changeWindowDimensionManually(): void {
    this.dimensionManuallyChange = true;
  }

  @HostListener('window:resize', ['$event'])
  changeWindowDimension(): void {
    if (!this.dimensionManuallyChange) {
      this.windowHeight = window.innerHeight - BUFFER_HEIGHT;
      this.windowWidth = window.innerWidth - BUFFER_WIDTH;
      this.newDrawing.patchValue({formHeight: this.windowHeight, formWidth: this.windowWidth});
    }
  }

  createNewDrawing(): void {
    if (!this.areDimensionsValid()) { return; }
    this.svgStockage.cleanDrawing();
    this.commands.clearCommand();
    this.drawingManager.height = Math.min(this.newDrawing.value[KEY_FORM_HEIGHT], this.windowHeight);
    this.drawingManager.width = Math.min(this.newDrawing.value[KEY_FORM_WIDTH], this.windowWidth);
    this.drawingManager.name = '';
    this.drawingManager.id = 0;
    this.drawingManager.backgroundColor = this.colorParameter.temporaryBackgroundColor;
    this.drawingManager.tags = [];
    this.ngZone.run(() => this.router.navigate(['dessin']));
    this.localSaving.saveState();
    this.dialogRef.close();
  }

  selectColor(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    this.colorWindow = this.dialog.open(ColorChoiceComponent, dialogConfig).componentInstance;
    this.colorWindow.scope = Scope.BackgroundNewDrawing;
  }

  getHeightClass(): string {
    return this.heightValid ? '' : 'invalid';
  }

  getWidthClass(): string {
    return this.widthValid ? '' : 'invalid';
  }
}
