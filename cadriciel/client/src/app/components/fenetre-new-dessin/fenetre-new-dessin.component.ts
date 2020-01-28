import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-fenetre-new-dessin',
  templateUrl: './fenetre-new-dessin.component.html',
  styleUrls: ['./fenetre-new-dessin.component.scss']
})

export class FenetreNewDessinComponent implements OnInit {
  hauteur: number;
  largeur: number;

  constructor(public dialogRef: MatDialogRef<FenetreNewDessinComponent>) {
    this.hauteur = window.innerHeight;
    this.largeur = window.innerWidth;
   }

   @HostListener('window:resize', ['$event'])
   redimmension(event: { target: { innerHeight: number; innerWidth: number; }; }){
    this.hauteur = event.target.innerHeight;
    this.largeur = event.target.innerWidth;
   }
  fermerFenetre() {
    this.dialogRef.close();
  }

 creationDessin() {
   this.dialogRef.close();
 }

  ngOnInit() { }

}
