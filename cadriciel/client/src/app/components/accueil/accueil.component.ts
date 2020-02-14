import { Component } from '@angular/core';
import {MatDialog, MatDialogConfig } from '@angular/material';
import { GestionnaireDessinService } from 'src/app/services/gestionnaire-dessin/gestionnaire-dessin.service';
import { FenetreNouveauDessinComponent } from '../fenetre-nouveau-dessin/fenetre-nouveau-dessin.component';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent {

  constructor(public dialog: MatDialog,
              public dessinManager: GestionnaireDessinService,
              public dialogConfig: MatDialogConfig) {
                dialogConfig.disableClose = true;
                dialogConfig.autoFocus = true;
                dialogConfig.width = '60%'; }

  creationDessin() {
    this.dialog.open(FenetreNouveauDessinComponent, this.dialogConfig);
  }

}
