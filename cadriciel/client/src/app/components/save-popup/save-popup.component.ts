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
  protected isSaving: boolean;
  private isNameValid: boolean;

  constructor(private dialogRef: MatDialogRef<SavePopupComponent>,
              private db: DatabaseService,
              private drawingParams: DrawingManagerService) {
    this.name = new FormControl(drawingParams.name);
    this.isSaving = false;
  }

  checkName(): boolean {
    this.isNameValid = (this.name.value !== '');
    return this.isNameValid;
  }

  async confirmSave(): Promise<void> {
    if (!this.checkName()) { return; }
    this.drawingParams.name = this.name.value;
    this.isSaving = true;
    await this.db.saveDrawing();
    this.isSaving = false;
    // this.dialogRef.close();
 }
  closeDialogue(): void {
    this.dialogRef.close();
  }

}
