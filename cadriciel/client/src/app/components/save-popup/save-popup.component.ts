import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ShortcutsManagerService } from 'src/app/services/shortcuts-manager.service';

@Component({
  selector: 'app-save-popup',
  templateUrl: './save-popup.component.html',
  styleUrls: ['./save-popup.component.scss']
})
export class SavePopupComponent {

  constructor(private dialogRef: MatDialogRef<SavePopupComponent>,
              private shortcuts: ShortcutsManagerService) {
    shortcuts.focusOnInput = true;
  }

  closeDialogue(): void {
    this.shortcuts.focusOnInput = false;
    this.dialogRef.close();
  }

}
