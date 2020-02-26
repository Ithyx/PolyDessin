import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { GestionnaireRaccourcisService } from 'src/app/services/shortcuts-manager.service';
import { FenetreNouveauDessinComponent } from '../fenetre-nouveau-dessin/fenetre-nouveau-dessin.component';

@Component({
  selector: 'app-avertissement-nouveau-dessin',
  templateUrl: './avertissement-nouveau-dessin.component.html',
  styleUrls: ['./avertissement-nouveau-dessin.component.scss']
})
export class AvertissementNouveauDessinComponent {

  constructor(public dialog: MatDialog,
              public raccourcis: GestionnaireRaccourcisService,
              public dialogRef: MatDialogRef<FenetreNouveauDessinComponent> ) {
   }

  annuler() {
    this.raccourcis.champDeTexteEstFocus = false;
    this.dialogRef.close();
  }

  ouvrirParametres() {
    this.dialogRef.close();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(FenetreNouveauDessinComponent, dialogConfig)
  }
}
