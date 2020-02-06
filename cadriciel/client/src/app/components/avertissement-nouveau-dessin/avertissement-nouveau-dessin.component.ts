import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { GestionnaireRaccourcisService } from 'src/app/services/gestionnaire-raccourcis.service';
import { FenetreNewDessinComponent } from '../fenetre-new-dessin/fenetre-new-dessin.component';

@Component({
  selector: 'app-avertissement-nouveau-dessin',
  templateUrl: './avertissement-nouveau-dessin.component.html',
  styleUrls: ['./avertissement-nouveau-dessin.component.scss']
})
export class AvertissementNouveauDessinComponent implements OnInit {

  constructor(private dialog: MatDialog,
              public raccourcis: GestionnaireRaccourcisService,
              public dialogRef: MatDialogRef<FenetreNewDessinComponent> ) {
   }

  ngOnInit() {
  }

  annuler() {
    this.raccourcis.champDeTexteEstFocus = false;
    this.dialogRef.close();
  }

  ouvrirParametres(){
    this.dialogRef.close();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(FenetreNewDessinComponent, dialogConfig)
  }
}
