import { Injector } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

import { ChoixCouleurComponent } from '../choix-couleur/choix-couleur.component';
import { FenetreNouveauDessinComponent, KEY_FORM_HAUTEUR, KEY_FORM_LARGEUR,
         TAMPON_HAUTEUR, TAMPON_LARGEUR } from './fenetre-nouveau-dessin.component';

describe('FenetreNouveauDessinComponent', () => {
  let component: FenetreNouveauDessinComponent;
  let fixture: ComponentFixture<FenetreNouveauDessinComponent>;

  const MatDialogRefStub: Partial<MatDialogRef<FenetreNouveauDessinComponent>> = {
    close() { /* NE RIEN FAIRE */ }
  }

  const injecteur = Injector.create(
    {providers: [{provide: MatDialogRef, useValue: {componentInstance: ChoixCouleurComponent}}]
  })

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, MatDialogModule, RouterModule.forRoot([{path: 'dessin', component: FenetreNouveauDessinComponent}]) ],
      declarations: [ FenetreNouveauDessinComponent ],
      providers: [ {provide: MatDialogRef, useValue: MatDialogRefStub} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FenetreNouveauDessinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS #fermerFenetre
  it('#fermerFenetre devrait réactiver les raccourcis avec champDeTexteEstFocus', () => {
    component.raccourcis.champDeTexteEstFocus = true;
    component.fermerFenetre();
    expect(component.raccourcis.champDeTexteEstFocus).toBe(false);
  })

  it('#fermerFenetre devrait appeler la fonction close de dialogRef', () => {
    spyOn(component.dialogRef, 'close');
    component.fermerFenetre();
    expect(component.dialogRef.close).toHaveBeenCalled();
  })

  // TESTS #dimmensionChangeeManuellement
  it('#dimmensionChangeeManuellement devrait mettre le booléen dimChangeeManuellement a true', () => {
    component.dimChangeeManuellement = false;
    component.dimmensionChangeeManuellement();
    expect(component.dimChangeeManuellement).toBe(true);
  })

  // TESTS #dimmensionsChangees
  it('#dimmensionsChangees ne devrait rien faire si les dimensions ont déjà été changées manuellement', () => {
    // valeurs normalement inatteignables
    component.largeurFenetre = -100;
    component.hauteurFenetre = -100;
    component.dimChangeeManuellement = true;
    component.dimmensionsChangees();
    expect(component.largeurFenetre).toBe(-100);
    expect(component.hauteurFenetre).toBe(-100);
  })

  it('#dimmensionsChangees devrait changer la hauteur et largeur stockée', () => {
    spyOnProperty(window, 'innerHeight').and.returnValue(100 + TAMPON_HAUTEUR);
    spyOnProperty(window, 'innerWidth').and.returnValue(100 + TAMPON_LARGEUR);
    component.dimmensionsChangees();
    expect(component.hauteurFenetre).toBe(100);
    expect(component.largeurFenetre).toBe(100);
  })

  it('#dimmensionsChangees appelle patchValue avec les bonnes valeurs', () => {
    spyOnProperty(window, 'innerHeight').and.returnValue(100 + TAMPON_HAUTEUR);
    spyOnProperty(window, 'innerWidth').and.returnValue(100 + TAMPON_LARGEUR);
    spyOn(component.nouveauDessin, 'patchValue');
    component.dimmensionsChangees();
    expect(component.nouveauDessin.patchValue).toHaveBeenCalledWith({hauteurFormulaire: 100, largeurFormulaire: 100});
  })

  // TESTS #validerNouveauDessin
  it('#validerNouveauDessin doit vider le dessin en cours', () => {
    spyOn(component.stockageSVG, 'viderDessin');
    component.validerNouveauDessin();
    expect(component.stockageSVG.viderDessin).toHaveBeenCalled();
  })

  it('#validerNouveauDessin doit metter à jour la hauteur de dessin', () => {
    component.nouveauDessin.value[KEY_FORM_HAUTEUR] = 100;
    component.nouveauDessin.value[KEY_FORM_LARGEUR] = 100;
    component.validerNouveauDessin();
    expect(component.serviceNouveauDessin.hauteur).toBe(100);
    expect(component.serviceNouveauDessin.largeur).toBe(100);
  })

  it('#validerNouveauDessin doit mettre réactiver les raccourcis à l\' aide de "champDeTexteEstFocus"', () => {
    component.raccourcis.champDeTexteEstFocus = true;
    component.validerNouveauDessin();
    expect(component.raccourcis.champDeTexteEstFocus).toBe(false);
  })

  it('#validerNouveauDessin devrait fermer la fenêtre de dialogue', () => {
    spyOn(component.dialogRef, 'close');
    component.validerNouveauDessin();
    expect(component.dialogRef.close).toHaveBeenCalled();
  })

  it('#validerNouveauDessin devrait changer la page actuelle à l\'aide du router vers celle de dessin', () => {
    spyOn(component.router, 'navigate');
    component.validerNouveauDessin();
    expect(component.router.navigate).toHaveBeenCalledWith(['dessin']);
  })

  // TESTS #selectionCouleur
  it('#selectionCouleur devrait appeler dialog.open avec les bons paramètres', () => {
    spyOn(component.dialog, 'open').and.returnValue(injecteur.get(MatDialogRef));

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.panelClass = 'fenetre-couleur';
    component.selectionCouleur();

    expect(component.dialog.open).toHaveBeenCalledWith(ChoixCouleurComponent, dialogConfig);
  })
});
