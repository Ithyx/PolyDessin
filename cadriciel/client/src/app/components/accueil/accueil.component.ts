import { Component } from '@angular/core';
import {MatDialog, MatDialogConfig } from '@angular/material';
import { DessinManagerService } from 'src/app/services/dessin-manager/dessin-manager.service';
import { FenetreNewDessinComponent } from '../fenetre-new-dessin/fenetre-new-dessin.component';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent {

  constructor(private dialog: MatDialog,
              public dessinManager: DessinManagerService) {}

  creationDessin() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(FenetreNewDessinComponent, dialogConfig)
  }

}
