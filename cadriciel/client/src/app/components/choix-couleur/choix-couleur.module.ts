import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChoixCouleurComponent } from './choix-couleur.component'
import { GlissiereCouleurComponent } from './glissiere-couleur/glissiere-couleur.component'

@NgModule({
  declarations: [ChoixCouleurComponent, GlissiereCouleurComponent],
  imports: [
    CommonModule
  ],
  exports: [ChoixCouleurComponent, GlissiereCouleurComponent],
})
export class ChoixCouleurModule { }
