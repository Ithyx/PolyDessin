import { Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig} from '@angular/material';
import { Subscription } from 'rxjs';
import { Scope } from 'src/app/services/color/color-manager.service';
import { ColorParameterService } from 'src/app/services/color/color-parameter.service';
import { CommandManagerService } from 'src/app/services/command/command-manager.service';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { ShortcutsManagerService } from 'src/app/services/shortcuts-manager.service';
import { SelectionService } from 'src/app/services/tools/selection/selection.service';
import { DrawingTool, ToolManagerService } from 'src/app/services/tools/tool-manager.service';
import { ColorChoiceComponent } from '../color-choice/color-choice.component';
import { GridOptionsComponent } from '../grid-options/grid-options.component';
import { NewDrawingWarningComponent } from '../new-drawing-warning/new-drawing-warning.component';
import { GalleryComponent } from '../gallery/gallery.component';

const PERCENTAGE = 100;

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})

export class ToolbarComponent implements OnDestroy {

  primaryScope: number;
  secondaryScope: number;
  colorPickerPopup: ColorChoiceComponent;

  private newDrawingSubscription: Subscription;

  constructor(public dialog: MatDialog,
              public tools: ToolManagerService,
              public shortcuts: ShortcutsManagerService,
              public colorParameter: ColorParameterService,
              public commands: CommandManagerService,
              public selection: SelectionService,
              public drawingManager: DrawingManagerService
             ) {
    this.newDrawingSubscription = shortcuts.newDrawingEmmiter.subscribe((isIgnored: boolean) => {
    if (!isIgnored) { this.warningNewDrawing(); }
    this.primaryScope = Scope.Primary;
    this.secondaryScope = Scope.Secondary;
    });
  }

  ngOnDestroy(): void {
    this.newDrawingSubscription.unsubscribe();
    this.shortcuts.newDrawingEmmiter.next(true);
  }

  onClick(tool: DrawingTool): void {
    if (this.tools.activeTool.name === 'Selection' && this.selection.selectionBox) {
      this.selection.deleteBoundingBox();
    }
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

  selectColor(scope: string): void {
    this.disableShortcuts();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.panelClass = 'fenetre-couleur';
    this.colorPickerPopup = this.dialog.open(ColorChoiceComponent, dialogConfig).componentInstance;
    if (scope === 'primary') {
      this.colorPickerPopup.portee = Scope.Primary;
    }
    if (scope === 'secondary') {
      this.colorPickerPopup.portee = Scope.Secondary;
    }
    if (scope === 'background') {
      this.colorPickerPopup.portee = Scope.BackgroundToolBar;
    }
  }

  openGridWindow(): void {
    this.disableShortcuts();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    this.dialog.open(GridOptionsComponent, dialogConfig);
  }

  selectPreviousPrimaryColor(chosenColor: string): void {
    this.colorParameter.primaryColor = chosenColor;
  }

  selectPreviousSecondaryColor(chosenColor: string, event: MouseEvent): void {
    this.colorParameter.secondaryColor = chosenColor;
    event.preventDefault();
  }

  applyPrimaryOpacity(event: Event): void {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    this.colorParameter.primaryOpacity = Math.max(Math.min(Number(eventCast.value), 1), 0);
    this.colorParameter.primaryOpacityDisplayed = Math.round(PERCENTAGE * this.colorParameter.primaryOpacity);
  }

  applySecondaryOpacity(event: Event): void {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    this.colorParameter.secondaryOpacity = Math.max(Math.min(Number(eventCast.value), 1), 0);
    this.colorParameter.secondaryOpacityDisplayed = Math.round(PERCENTAGE * this.colorParameter.secondaryOpacity);
  }
}
