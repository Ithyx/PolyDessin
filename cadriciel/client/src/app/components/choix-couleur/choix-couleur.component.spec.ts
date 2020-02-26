import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material';

import { Portee } from 'src/app/services/couleur/color-manager.service';
import { ParametresCouleurService } from 'src/app/services/couleur/color-parameter.service';
import { ChoixCouleurComponent } from './choix-couleur.component';
import { CouleurPaletteComponent } from './couleur-palette/couleur-palette.component';
import { GlissiereCouleurComponent } from './glissiere-couleur/glissiere-couleur.component';
import { ValeurCouleurComponent } from './valeur-couleur/valeur-couleur.component';

const MatDialogRefStub: Partial<MatDialogRef<ChoixCouleurComponent>> = {
  close() { /* NE RIEN FAIRE */ }
}

describe('ChoixCouleurComponent', () => {
  let component: ChoixCouleurComponent;
  let fixture: ComponentFixture<ChoixCouleurComponent>;
  let couleur: ParametresCouleurService;
  const COULEUR_TEST = 'rgba(20, 20, 20, 1)';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoixCouleurComponent, CouleurPaletteComponent, GlissiereCouleurComponent,
        ValeurCouleurComponent ],
      providers: [ { provide: MatDialogRef, useValue: MatDialogRefStub } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoixCouleurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    couleur = TestBed.get(ParametresCouleurService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS fermerFenetre

  it('#fermerFenetre devrait fermer le popup', () => {
    spyOn(component.dialogRef, 'close');
    component.fermerFenetre();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  // TESTS appliquerCouleur

  it('#appliquerCouleur devrait appliquer la couleur principale', () => {
    component.gestionnaireCouleur.couleur = COULEUR_TEST;
    component.portee = Portee.Principale;
    component.appliquerCouleur();
    expect(couleur.couleurPrincipale).toBe(COULEUR_TEST);
  });

  it('#appliquerCouleur devrait appliquer la couleur secondaire', () => {
    component.gestionnaireCouleur.couleur = COULEUR_TEST;
    component.portee = Portee.Secondaire;
    component.appliquerCouleur();
    expect(couleur.couleurSecondaire).toBe(COULEUR_TEST);
  });

  it('#appliquerCouleur devrait appliquer la couleur de fond', () => {
    component.gestionnaireCouleur.couleur = COULEUR_TEST.slice(0, -2);
    component.portee = Portee.Fond;
    component.appliquerCouleur();
    expect(couleur.couleurFond).toBe(COULEUR_TEST);
  });

  it('#appliquerCouleur devrait fermer le popup', () => {
    spyOn(component.dialogRef, 'close');
    component.appliquerCouleur();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });
});
