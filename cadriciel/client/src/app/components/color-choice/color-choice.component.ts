import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ColorManagerService, Scope } from 'src/app/services/color/color-manager.service';

@Component({
  selector: 'app-color-choice',
  templateUrl: './color-choice.component.html',
  styleUrls: ['./color-choice.component.scss'],
  providers: [ColorManagerService]
})
export class ColorChoiceComponent  {

  scope: Scope;

  constructor(private colorManager: ColorManagerService,
              public dialogRef: MatDialogRef<ColorChoiceComponent>
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

}
