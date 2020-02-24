import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { GestionnaireRaccourcisService } from 'src/app/services/gestionnaire-raccourcis.service';
import { FenetreNouveauDessinComponent } from '../fenetre-nouveau-dessin/fenetre-nouveau-dessin.component';

@Component({
  selector: 'app-grid-options',
  templateUrl: './grid-options.component.html',
  styleUrls: ['./grid-options.component.scss']
})
export class GridOptionsComponent {

  constructor(public dialogRef: MatDialogRef<FenetreNouveauDessinComponent>,
              public raccourcis: GestionnaireRaccourcisService) { }

  closeWindow() {
    this.raccourcis.champDeTexteEstFocus = false;
    this.dialogRef.close();
  }

}
