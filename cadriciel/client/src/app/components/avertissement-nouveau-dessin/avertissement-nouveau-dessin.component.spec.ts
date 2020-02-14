import { Injector } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogConfig, MatDialogModule, MatDialogRef, } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { FenetreNouveauDessinComponent } from '../fenetre-nouveau-dessin/fenetre-nouveau-dessin.component';
import { AvertissementNouveauDessinComponent } from './avertissement-nouveau-dessin.component';

describe('AvertissementNouveauDessinComponent', () => {
  let component: AvertissementNouveauDessinComponent;
  let fixture: ComponentFixture<AvertissementNouveauDessinComponent>;

  const injecteur = Injector.create(
    {providers: [{provide: MatDialogRef, useValue: {componentInstance: AvertissementNouveauDessinComponent}}]
  })

  const MatDialogRefStub: Partial<MatDialogRef<AvertissementNouveauDessinComponent>> = {
    close() { /* NE RIEN FAIRE */ }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MatDialogModule, BrowserAnimationsModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule,
                 RouterModule.forRoot([]) ],
      declarations: [ AvertissementNouveauDessinComponent, FenetreNouveauDessinComponent ],
      providers: [ {provide: MatDialogRef, useValue: MatDialogRefStub} ]
    })
    .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ FenetreNouveauDessinComponent ] } })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvertissementNouveauDessinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS annuler

  it('#annuler devrait désactiver le focus sur un champ de texte', () => {
    component.raccourcis.champDeTexteEstFocus = true;
    component.annuler();
    expect(component.raccourcis.champDeTexteEstFocus).toBe(false);
  });

  it('#annuler devrait fermer dialogRef', () => {
    spyOn(component.dialogRef, 'close');
    component.annuler();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  // TESTS ouvrirParametre

  it('#ouvrirParametre devrait fermer dialogRef', () => {
    spyOn(component.dialogRef, 'close');
    component.ouvrirParametres();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('#ouvrirParametre devrait appeler dialog.open avec les bons paramètres', () => {
    spyOn(component.dialog, 'open').and.returnValue(injecteur.get(MatDialogRef));

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    component.ouvrirParametres();

    expect(component.dialog.open).toHaveBeenCalledWith(FenetreNouveauDessinComponent, dialogConfig);
  });

});
