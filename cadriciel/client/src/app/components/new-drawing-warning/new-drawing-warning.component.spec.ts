import { Injector } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogConfig, MatDialogModule, MatDialogRef, } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { NewDrawingWindowComponent } from '../new-drawing-window/new-drawing-window.component';
import { NewDrawingWarningComponent } from './new-drawing-warning.component';

describe('NewDrawingWarningComponent', () => {
  let component: NewDrawingWarningComponent;
  let fixture: ComponentFixture<NewDrawingWarningComponent>;

  const injecteur = Injector.create(
    {providers: [{provide: MatDialogRef, useValue: {componentInstance: NewDrawingWarningComponent}}]
  });

  const matDialogRefStub: Partial<MatDialogRef<NewDrawingWarningComponent>> = {
    close(): void { /* NE RIEN FAIRE */ }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MatDialogModule, BrowserAnimationsModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule,
                 RouterModule.forRoot([]) ],
      declarations: [ NewDrawingWarningComponent, NewDrawingWindowComponent ],
      providers: [ {provide: MatDialogRef, useValue: matDialogRefStub} ]
    })
    .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ NewDrawingWindowComponent ] } })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDrawingWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS cancel

  it('#cancel devrait désactiver le focus sur un champ de texte', () => {
    component.shortcuts.focusOnInput = true;
    component.cancel();
    expect(component.shortcuts.focusOnInput).toBe(false);
  });

  it('#cancel devrait fermer dialogRef', () => {
    spyOn(component.dialogRef, 'close');
    component.cancel();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  // TESTS ouvrirParametre

  it('#ouvrirParametre devrait fermer dialogRef', () => {
    spyOn(component.dialogRef, 'close');
    component.openParameter();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('#ouvrirParametre devrait appeler dialog.open avec les bons paramètres', () => {
    spyOn(component.dialog, 'open').and.returnValue(injecteur.get(MatDialogRef));

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    component.openParameter();

    expect(component.dialog.open).toHaveBeenCalledWith(NewDrawingWindowComponent, dialogConfig);
  });

});
