import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { DatabaseService } from 'src/app/services/database/database.service';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';

@Component({
  selector: 'app-save-popup',
  templateUrl: './save-popup.component.html',
  styleUrls: ['./save-popup.component.scss']
})
export class SavePopupComponent {

  private name: FormControl;

  constructor(private dialogRef: MatDialogRef<SavePopupComponent>,
              private db: DatabaseService,
              private drawingParams: DrawingManagerService) {
    this.name = new FormControl();
  }

  confirmSave(): void {
    this.drawingParams.name = this.name.value;
    this.db.saveDrawing();
    this.dialogRef.close();
 }
  closeDialogue(): void {
    this.dialogRef.close();
  }

}
