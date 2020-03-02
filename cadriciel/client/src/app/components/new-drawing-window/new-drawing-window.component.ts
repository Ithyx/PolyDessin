import { Component, HostListener, NgZone } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { ColorChoiceComponent } from 'src/app/components/color-choice/color-choice.component';
import { Scope } from 'src/app/services/color/color-manager.service';
import { ColorParameterService } from 'src/app/services/color/color-parameter.service';
import { CommandManagerService } from 'src/app/services/command/command-manager.service';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { ShortcutsManagerService } from 'src/app/services/shortcuts-manager.service';
import { SVGStockageService } from 'src/app/services/stockage-svg/svg-stockage.service';

export const KEY_FORM_HEIGHT = 'formHeight';
export const KEY_FORM_WIDHT = 'formWidth';
export const KEY_FORM_NAME = 'formName';
export const BUFFER_WIDTH = 510;
export const BUFFER_HEIGHT = 15;

@Component({
  selector: 'app-new-drawing-window',
  templateUrl: './new-drawing-window.component.html',
  styleUrls: ['./new-drawing-window.component.scss']
})

export class NewDrawingWindowComponent {
  windowHeight: number;
  windowWidth: number;

  dimensionManuallyChange: boolean;

  newDrawing: FormGroup;

  constructor(public dialogRef: MatDialogRef<NewDrawingWindowComponent>,
              public shortcuts: ShortcutsManagerService,
              public drawingManager: DrawingManagerService,
              public router: Router,
              public SVGStockage: SVGStockageService,
              public dialog: MatDialog,
              public colorParameter: ColorParameterService,
              public commands: CommandManagerService,
              private ngZone: NgZone ) {
    this.windowHeight = window.innerHeight - BUFFER_HEIGHT;
    this.windowWidth = window.innerWidth - BUFFER_WIDTH;
    this.dimensionManuallyChange = false;

    this.newDrawing = new FormGroup({
      formName: new FormControl(),
      formHeight: new FormControl(this.windowHeight),
      formWidth: new FormControl(this.windowWidth),
    });

    this.changeWindowDimension();
  }

  closeWindow(): void {
    this.colorParameter.temporaryBackgroundColor = this.drawingManager.backgroundColor;
    this.shortcuts.focusOnInput = false;
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
    this.SVGStockage.cleanDrawing();
    this.commands.clearCommand();
    this.drawingManager.height = this.newDrawing.value[KEY_FORM_HEIGHT];
    this.drawingManager.width = this.newDrawing.value[KEY_FORM_WIDHT];
    this.drawingManager.name = this.newDrawing.value[KEY_FORM_NAME];
    this.drawingManager.id = 0;
    this.drawingManager.backgroundColor = this.colorParameter.temporaryBackgroundColor;
    this.shortcuts.focusOnInput = false;
    this.dialogRef.close();
    this.ngZone.run(() => this.router.navigate(['dessin']));
  }

  selectColor(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.panelClass = 'fenetre-couleur';
    this.dialog.open(ColorChoiceComponent, dialogConfig).componentInstance.portee = Scope.BackgroundNewDrawing;
  }
}
