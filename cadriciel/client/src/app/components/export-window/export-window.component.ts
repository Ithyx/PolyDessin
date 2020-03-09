import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import { ShortcutsManagerService } from 'src/app/services/shortcuts-manager.service';

@Component({
  selector: 'app-export-window',
  templateUrl: './export-window.component.html',
  styleUrls: ['./export-window.component.scss']
})

export class ExportWindowComponent {

  constructor(public dialog: MatDialog,
              public shortcuts: ShortcutsManagerService,
              public dialogRef: MatDialogRef<ExportWindowComponent> ) { }

  cancel(): void {
    this.shortcuts.focusOnInput = false;
    this.dialogRef.close();
  }

  openParameter(): void {
    this.dialogRef.close();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(ExportWindowComponent, dialogConfig);
  }

}
