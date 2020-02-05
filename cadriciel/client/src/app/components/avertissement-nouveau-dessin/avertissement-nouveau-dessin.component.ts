import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { GestionnaireRaccourcisService } from 'src/app/services/gestionnaire-raccourcis.service';
import { FenetreNewDessinComponent } from '../fenetre-new-dessin/fenetre-new-dessin.component';

@Component({
  selector: 'app-avertissement-nouveau-dessin',
  templateUrl: './avertissement-nouveau-dessin.component.html',
  styleUrls: ['./avertissement-nouveau-dessin.component.scss']
})
export class AvertissementNouveauDessinComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AvertissementNouveauDessinComponent>,
              private dialog: MatDialog,
              public raccourcis: GestionnaireRaccourcisService ) {
   }

  ngOnInit() {
  }

  annuler() {
    this.dialogRef.close();
    this.raccourcis.champDeTexteEstFocus = false;
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
