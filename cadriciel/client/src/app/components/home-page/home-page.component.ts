import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { FenetreNouveauDessinComponent } from '../fenetre-nouveau-dessin/fenetre-nouveau-dessin.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

  constructor(public dialog: MatDialog,
              public drawingManager: DrawingManagerService,
              public dialogConfig: MatDialogConfig) {
                dialogConfig.disableClose = true;
                dialogConfig.autoFocus = true;
                dialogConfig.width = '60%'; }

  createDrawing() {
    this.dialog.open(FenetreNouveauDessinComponent, this.dialogConfig);
  }

}
