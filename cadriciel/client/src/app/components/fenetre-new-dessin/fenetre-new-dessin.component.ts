import { Component, HostListener, OnInit } from '@angular/core';
import {  FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-fenetre-new-dessin',
  templateUrl: './fenetre-new-dessin.component.html',
  styleUrls: ['./fenetre-new-dessin.component.scss']
})

export class FenetreNewDessinComponent implements OnInit {
  hauteurFenetre: number;
  largeurFenetre: number;
  nouveauDessin = new FormGroup({
    hauteurFormulaire: new FormControl(''),
    largeurFormulaire: new FormControl(''),
    couleur: new FormControl('#ffffff'),
  });
  constructor(public dialogRef: MatDialogRef<FenetreNewDessinComponent>) {}
  fermerFenetre() {
    this.dialogRef.close();
  }

 creationDessin() {
   this.dialogRef.close();
 }

 onSubmit() {
  // TODO: Use EventEmitter with form value
  console.warn(this.nouveauDessin.value);
}
  ngOnInit() {
  this.hauteurFenetre = window.innerHeight;
  this.largeurFenetre = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
onResize(event: { target: { innerLength: number; innerWidth: number; }; }) {
  this.hauteurFenetre = event.target.innerLength;
  this.largeurFenetre = event.target.innerWidth;
}
}
