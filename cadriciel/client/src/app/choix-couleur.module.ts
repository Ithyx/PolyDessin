import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChoixCouleurComponent } from './components/choix-couleur/choix-couleur.component'

@NgModule({
  declarations: [ChoixCouleurComponent],
  imports: [
    CommonModule
  ],
  exports: [ChoixCouleurComponent],
})
export class ChoixCouleurModule { }
