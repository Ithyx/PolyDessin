import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { ShortcutsManagerService } from 'src/app/services/shortcuts-manager.service';
import { FenetreNouveauDessinComponent } from '../fenetre-nouveau-dessin/fenetre-nouveau-dessin.component';

@Component({
  selector: 'app-new-drawing-warning',
  templateUrl: './new-drawing-warning.component.html',
  styleUrls: ['./new-drawing-warning.component.scss']
})
export class NewDrawingWarningComponent {

  constructor(public dialog: MatDialog,
              public shortcuts: ShortcutsManagerService,
              public dialogRef: MatDialogRef<FenetreNouveauDessinComponent> ) {
   }

  cancel() {
    this.shortcuts.focusOnInput = false;
    this.dialogRef.close();
  }

  openParameter() {
    this.dialogRef.close();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(FenetreNouveauDessinComponent, dialogConfig)
  }
}
