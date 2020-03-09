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
  private tag: FormControl;
  protected isSaving: boolean;
  private isNameValid: boolean;
  private isTagValid: boolean;

  constructor(private dialogRef: MatDialogRef<SavePopupComponent>,
              private db: DatabaseService,
              private drawingParams: DrawingManagerService) {
    this.name = new FormControl(drawingParams.name);
    this.tag = new FormControl();
    this.isSaving = false;
    this.isTagValid = false;
  }

  checkName(): boolean {
    this.isNameValid = (this.name.value !== '');
    return this.isNameValid;
  }

  checkTag(): boolean {
    this.isTagValid = (this.tag.value !== '');
    return this.isTagValid;
  }

  async confirmSave(): Promise<void> {
    if (!this.checkName()) { return; }
    this.drawingParams.name = this.name.value;
    this.isSaving = true;
    await this.db.saveDrawing();
    this.isSaving = false;
    // this.dialogRef.close();
  }

  addTag(): void {
    if (!this.checkTag() || this.drawingParams.tags.indexOf(this.tag.value) !== -1) { return; }
    this.drawingParams.tags.push(this.tag.value);
  }

  deleteTag(tag: string): void {
    this.drawingParams.tags = this.drawingParams.tags.filter((element) => element !== tag);
  }

  closeDialogue(): void {
    this.dialogRef.close();
  }

}
