import { Component, OnInit } from '@angular/core';
import { MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-fenetre-new-dessin',
  templateUrl: './fenetre-new-dessin.component.html',
  styleUrls: ['./fenetre-new-dessin.component.scss']
})
export class FenetreNewDessinComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FenetreNewDessinComponent>) { }

  fermerFenetre() {
    this.dialogRef.close();
  }

 creationDessin() {
   this.dialogRef.close();
 }

  ngOnInit() { }

}
