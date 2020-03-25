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
  private predefinedTag: FormControl;
  protected isSaving: boolean;
  private isNameValid: boolean;
  private isTagValid: boolean;
  private saveFailed: boolean;
  protected PREDEFINED_TAGS: string[];

  constructor(private dialogRef: MatDialogRef<SavePopupComponent>,
              private db: DatabaseService,
              private drawingParams: DrawingManagerService) {
    this.name = new FormControl(drawingParams.name);
    this.tag = new FormControl('');
    this.predefinedTag = new FormControl('Portrait');
    this.isSaving = false;
    this.isNameValid = (drawingParams.name !== '');
    this.isTagValid = false;
    this.saveFailed = false;
    this.PREDEFINED_TAGS = ['Portrait', 'Paysage', 'Pixel Art', 'Abstrait', 'Futuriste', 'Minimaliste'];
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
    try {
      await this.db.saveDrawing();
      this.saveFailed = false;
    } catch (err) {
      this.saveFailed = true;
    }
    this.isSaving = false;
    if (!this.saveFailed) { this.closeDialogue(); }
  }

  addTag(): void {
    if (!this.checkTag() || this.drawingParams.tags.indexOf(this.tag.value) !== -1) { return; }
    this.drawingParams.tags.push(this.tag.value);
  }

  addPredefinedTag(): void {
    if (this.drawingParams.tags.indexOf(this.predefinedTag.value) !== -1) { return; }
    this.drawingParams.tags.push(this.predefinedTag.value);
  }

  deleteTag(tag: string): void {
    this.drawingParams.tags = this.drawingParams.tags.filter((element) => element !== tag);
  }

  closeDialogue(): void {
    this.dialogRef.close();
  }

}
