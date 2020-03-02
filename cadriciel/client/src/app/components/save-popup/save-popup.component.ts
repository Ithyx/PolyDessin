import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DatabaseService } from 'src/app/services/database/database.service';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';

@Component({
  selector: 'app-save-popup',
  templateUrl: './save-popup.component.html',
  styleUrls: ['./save-popup.component.scss']
})
export class SavePopupComponent {

  constructor(private dialogRef: MatDialogRef<SavePopupComponent>,
              private db: DatabaseService,
              private drawingParams: DrawingManagerService) {}

  confirmSave(): void {
    (this.drawingParams.id === 0) ? this.db.sendNewDrawing() : this.db.updateDrawing();
    this.dialogRef.close();
 }
  closeDialogue(): void {
    this.dialogRef.close();
  }

}
