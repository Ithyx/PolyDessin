import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChoixCouleurComponent } from './choix-couleur.component'
import { GlissiereCouleurComponent } from './glissiere-couleur/glissiere-couleur.component'
import { CouleurPaletteComponent } from './couleur-palette/couleur-palette.component'

@NgModule({
  declarations: [ChoixCouleurComponent, GlissiereCouleurComponent, CouleurPaletteComponent],
  imports: [
    CommonModule
  ],
  exports: [ChoixCouleurComponent, GlissiereCouleurComponent],
})
export class ChoixCouleurModule { }
