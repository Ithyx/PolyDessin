import { Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig} from '@angular/material';
import { Subscription } from 'rxjs';
import { PERCENTAGE, Scope } from 'src/app/services/color/color-manager.service';
import { ColorParameterService } from 'src/app/services/color/color-parameter.service';
import { CommandManagerService } from 'src/app/services/command/command-manager.service';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { ShortcutsManagerService } from 'src/app/services/shortcuts-manager.service';
import { A, Color } from 'src/app/services/stockage-svg/draw-element';
import { DrawingTool, ToolManagerService } from 'src/app/services/tools/tool-manager.service';
import { ColorChoiceComponent } from '../color-choice/color-choice.component';
import { ExportWindowComponent } from '../export-window/export-window.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { GridOptionsComponent } from '../grid-options/grid-options.component';
import { NewDrawingWarningComponent } from '../new-drawing-warning/new-drawing-warning.component';
import { SavePopupComponent } from '../save-popup/save-popup.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})

export class ToolbarComponent implements OnDestroy {

  private colorPickerPopup: ColorChoiceComponent;
  private newDrawingSubscription: Subscription;

  constructor(private dialog: MatDialog,
              private tools: ToolManagerService,
              private shortcuts: ShortcutsManagerService,
              private colorParameter: ColorParameterService,
              protected commands: CommandManagerService,
              protected drawingManager: DrawingManagerService
             ) {
    this.newDrawingSubscription = shortcuts.newDrawingEmmiter.subscribe((isIgnored: boolean) => {
    if (!isIgnored) { this.warningNewDrawing(); }
    });
  }

  ngOnDestroy(): void {
    this.newDrawingSubscription.unsubscribe();
    this.shortcuts.newDrawingEmmiter.next(true);
  }

  onClick(tool: DrawingTool): void {
    this.tools.activeTool.isActive = false;
    this.tools.activeTool = tool;
    this.tools.activeTool.isActive = true;
    this.shortcuts.clearOngoingSVG();
  }

  onChange(event: Event, parameterName: string, min: number, max: number): void {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    const validatedValue = Math.max(Math.min(Number(eventCast.value), max), min);
    this.tools.activeTool.parameters[this.tools.findParameterIndex(parameterName)].value = validatedValue;
  }

  selectChoice(event: Event, parameterName: string): void {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    this.tools.activeTool.parameters[this.tools.findParameterIndex(parameterName)].chosenOption = eventCast.value;
  }

  disableShortcuts(): void {
    this.shortcuts.focusOnInput = true;
  }

  enableShortcuts(): void {
    this.shortcuts.focusOnInput = false;
  }

  warningNewDrawing(): void {
    this.disableShortcuts();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(NewDrawingWarningComponent, dialogConfig);
  }

  openGallery(): void {
    this.disableShortcuts();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    this.dialog.open(GalleryComponent, dialogConfig).afterClosed().subscribe(this.enableShortcuts.bind(this));
  }

  openSavePopup(): void {
    this.disableShortcuts();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(SavePopupComponent, dialogConfig).afterClosed().subscribe(this.enableShortcuts.bind(this));
  }

  selectColor(scope: string): void {
    this.disableShortcuts();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.panelClass = 'fenetre-couleur';
    this.colorPickerPopup = this.dialog.open(ColorChoiceComponent, dialogConfig).componentInstance;
    if (scope === 'primary') {
      this.colorPickerPopup.scope = Scope.Primary;
    }
    if (scope === 'secondary') {
      this.colorPickerPopup.scope = Scope.Secondary;
    }
    if (scope === 'background') {
      this.colorPickerPopup.scope = Scope.BackgroundToolBar;
    }
  }

  openExportWindow(): void {
    this.disableShortcuts();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(ExportWindowComponent, dialogConfig).afterClosed().subscribe(this.enableShortcuts.bind(this));
  }

  openGridWindow(): void {
    this.disableShortcuts();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    this.dialog.open(GridOptionsComponent, dialogConfig);
  }

  selectPreviousPrimaryColor(chosenColor: Color): void {
    this.colorParameter.primaryColor = {...chosenColor};
  }

  selectPreviousSecondaryColor(chosenColor: Color, event: MouseEvent): void {
    this.colorParameter.secondaryColor = {...chosenColor};
    event.preventDefault();
  }

  applyPrimaryOpacity(event: Event): void {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    this.colorParameter.primaryColor.RGBA[A] = Math.max(Math.min(Number(eventCast.value), 1), 0);
    this.colorParameter.updateColors();
    this.colorParameter.primaryOpacityDisplayed = Math.round(PERCENTAGE * this.colorParameter.primaryColor.RGBA[A]);
  }

  applySecondaryOpacity(event: Event): void {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    this.colorParameter.secondaryColor.RGBA[A] = Math.max(Math.min(Number(eventCast.value), 1), 0);
    this.colorParameter.updateColors();
    this.colorParameter.secondaryOpacityDisplayed = Math.round(PERCENTAGE * this.colorParameter.secondaryColor.RGBA[A]);
  }
}
