import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DatabaseService } from 'src/app/services/database/database.service';

@Component({
  selector: 'app-save-popup',
  templateUrl: './save-popup.component.html',
  styleUrls: ['./save-popup.component.scss']
})
export class SavePopupComponent {

  constructor(private dialogRef: MatDialogRef<SavePopupComponent>,
              private db: DatabaseService) {}

  confirmSave(): void {
    this.db.saveDrawing();
    this.dialogRef.close();
 }
  closeDialogue(): void {
    this.dialogRef.close();
  }

}
