import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig } from '@angular/material';
import { FenetreNewDessinComponent } from '../fenetre-new-dessin/fenetre-new-dessin.component';


@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {

  constructor(private dialog: MatDialog
    ) {}

  onCreate(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(FenetreNewDessinComponent, dialogConfig)
  }
  

  ngOnInit() {
  }

}
