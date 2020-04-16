import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ColorManagerService, Scope } from 'src/app/services/color/color-manager.service';
import { ColorPickerComponent } from './color-picker/color-picker.component';

@Component({
  selector: 'app-color-choice',
  templateUrl: './color-choice.component.html',
  styleUrls: ['./color-choice.component.scss'],
  providers: [ColorManagerService]
})
export class ColorChoiceComponent  {

  @ViewChild('picker', {static: false})
  private picker: ColorPickerComponent;

  scope: Scope;

  constructor(private colorManager: ColorManagerService,
              private dialogRef: MatDialogRef<ColorChoiceComponent>
             ) {
               this.scope = Scope.Primary;
             }

  closeWindow(): void {
    this.dialogRef.close();
  }

  applyColor(): void {
    this.colorManager.applyColor(this.scope);
    this.dialogRef.close();
  }

  notificationReceived(): void {
    this.picker.draw();
  }
}
