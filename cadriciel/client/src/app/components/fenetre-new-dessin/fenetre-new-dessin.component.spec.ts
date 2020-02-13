import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

import { FenetreNewDessinComponent } from './fenetre-new-dessin.component';

describe('FenetreNewDessinComponent', () => {
  let component: FenetreNewDessinComponent;
  let fixture: ComponentFixture<FenetreNewDessinComponent>;

  const MatDialogRefStub: Partial<MatDialogRef<FenetreNewDessinComponent>> = {
    close() { /* NE RIEN FAIRE */ }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, MatDialogModule, RouterModule.forRoot([]) ],
      declarations: [ FenetreNewDessinComponent ],
      providers: [ {provide: MatDialogRef, useValue: MatDialogRefStub} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FenetreNewDessinComponent);
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

  it('#dimmensionsChangees ')
});
