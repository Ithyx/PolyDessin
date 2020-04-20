import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ClipboardService } from 'src/app/services/clipboard/clipboard.service';
import { A, B, Color, G, R } from 'src/app/services/color/color';
import { PERCENTAGE, Scope } from 'src/app/services/color/color-manager.service';
import { ColorParameterService } from 'src/app/services/color/color-parameter.service';
import { CommandManagerService } from 'src/app/services/command/command-manager.service';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { ShortcutsManagerService } from 'src/app/services/shortcuts/shortcuts-manager.service';
import { ToolManagerService } from 'src/app/services/tools/tool-manager.service';
import { ColorChoiceComponent } from '../color-choice/color-choice.component';

@Component({
  selector: 'app-attributes-panel',
  templateUrl: './attributes-panel.component.html',
  styleUrls: ['./attributes-panel.component.scss']
})
export class AttributesPanelComponent {

  private colorPickerPopup: ColorChoiceComponent;

  constructor(private dialog: MatDialog,
              private tools: ToolManagerService,
              private colorParameter: ColorParameterService,
              protected commands: CommandManagerService,
              private shortcuts: ShortcutsManagerService,
              protected drawingManager: DrawingManagerService,
              protected clipboard: ClipboardService) { }

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

  selectPreviousPrimaryColor(chosenColor: Color): void {
    this.colorParameter.primaryColor.RGBA = [chosenColor.RGBA[R], chosenColor.RGBA[G], chosenColor.RGBA[B],
      this.colorParameter.primaryColor.RGBA[A]];
    this.colorParameter.updateColors();
  }

  selectPreviousSecondaryColor(chosenColor: Color, event: MouseEvent): void {
    this.colorParameter.secondaryColor.RGBA = [chosenColor.RGBA[R], chosenColor.RGBA[G], chosenColor.RGBA[B],
      this.colorParameter.secondaryColor.RGBA[A]];
    this.colorParameter.updateColors();
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
