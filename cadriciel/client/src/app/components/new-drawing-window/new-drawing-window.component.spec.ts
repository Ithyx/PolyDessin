import { Injector } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

import { Scope } from 'src/app/services/color/color-manager.service';
import { ColorChoiceComponent } from '../color-choice/color-choice.component';
import { BUFFER_HEIGHT, BUFFER_WIDTH, KEY_FORM_HEIGHT, KEY_FORM_WIDTH , NewDrawingWindowComponent } from './new-drawing-window.component';

// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers

describe('NewDrawingWindowComponent', () => {
  let component: NewDrawingWindowComponent;
  let fixture: ComponentFixture<NewDrawingWindowComponent>;

  const matDialogRefStub: Partial<MatDialogRef<NewDrawingWindowComponent>> = {
    close(): void { /* NE RIEN FAIRE */ }
  };

  const injector = Injector.create(
    {providers: [{provide: MatDialogRef, useValue: {componentInstance: ColorChoiceComponent}}]
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, MatDialogModule, RouterModule.forRoot([{path: 'dessin', component: NewDrawingWindowComponent}]) ],
      declarations: [ NewDrawingWindowComponent ],
      providers: [ {provide: MatDialogRef, useValue: matDialogRefStub} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDrawingWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS areDimensionsValid

  it('#areDimensionsValid devrait retourner true si la largeur et la hauteur sont strictement positives', () => {
    component['newDrawing'].value[KEY_FORM_HEIGHT] = 200;
    component['newDrawing'].value[KEY_FORM_WIDTH] = 200;
    expect(component.areDimensionsValid()).toBe(true);
  });

  it('#areDimensionsValid devrait retourner false si la largeur est négative', () => {
    component['newDrawing'].value[KEY_FORM_HEIGHT] = 200;
    component['newDrawing'].value[KEY_FORM_WIDTH] = -5;
    expect(component.areDimensionsValid()).toBe(false);
  });

  it('#areDimensionsValid devrait retourner false si la hauteur est négative', () => {
    component['newDrawing'].value[KEY_FORM_HEIGHT] = -5;
    component['newDrawing'].value[KEY_FORM_WIDTH] = 200;
    expect(component.areDimensionsValid()).toBe(false);
  });

  // TESTS #closeWindow

  // it('#closeWindow devrait réactiver les raccourcis avec champDeTexteEstFocus', () => {
  //   component['shortcuts'].focusOnInput = true;
  //   component.closeWindow();
  //   expect(component['shortcuts'].focusOnInput).toBe(false);
  // });

  it('#closeWindow devrait appeler la fonction close de dialogRef', () => {
    spyOn(component['dialogRef'], 'close');
    component.closeWindow();
    expect(component['dialogRef'].close).toHaveBeenCalled();
  });

  // TESTS #changeWindowDimensionManually

  it('#changeWindowDimensionManually devrait mettre le booléen dimensionManuallyChange a true', () => {
    component['dimensionManuallyChange'] = false;
    component.changeWindowDimensionManually();
    expect(component['dimensionManuallyChange']).toBe(true);
  });

  // TESTS #changeWindowDimension

  it('#changeWindowDimension ne devrait rien faire si les dimensions ont déjà été changées manuellement', () => {
    // valeurs normalement inatteignables
    component['windowWidth'] = -100;
    component['windowHeight'] = -100;
    component['dimensionManuallyChange'] = true;
    component.changeWindowDimension();
    expect(component['windowWidth']).toBe(-100);
    expect(component['windowHeight']).toBe(-100);
  });

  it('#changeWindowDimension devrait changer la hauteur et largeur stockée', () => {
    spyOnProperty(window, 'innerHeight').and.returnValue(100 + BUFFER_HEIGHT);
    spyOnProperty(window, 'innerWidth').and.returnValue(100 + BUFFER_WIDTH);
    component.changeWindowDimension();
    expect(component['windowHeight']).toBe(100);
    expect(component['windowWidth']).toBe(100);
  });

  it('#changeWindowDimension appelle patchValue avec les bonnes valeurs', () => {
    spyOnProperty(window, 'innerHeight').and.returnValue(100 + BUFFER_HEIGHT);
    spyOnProperty(window, 'innerWidth').and.returnValue(100 + BUFFER_WIDTH);
    spyOn(component['newDrawing'], 'patchValue');
    component.changeWindowDimension();
    expect(component['newDrawing'].patchValue).toHaveBeenCalledWith({formHeight: 100, formWidth: 100});
  });

  // TESTS #createNewDrawing

  it('#createNewDrawing doit vider le dessin en cours', () => {
    spyOn(component['svgStockage'], 'cleanDrawing');
    component.createNewDrawing();
    expect(component['svgStockage'].cleanDrawing).toHaveBeenCalled();
  });

  it('#createNewDrawing doit metter à jour la hauteur de dessin', () => {
    component['newDrawing'].value[KEY_FORM_HEIGHT] = 100;
    component['newDrawing'].value[KEY_FORM_WIDTH] = 100;
    component.createNewDrawing();
    expect(component['drawingManager'].height).toBe(100);
    expect(component['drawingManager'].width).toBe(100);
  });

  // it('#createNewDrawing doit mettre réactiver les raccourcis à l\' aide de "champDeTexteEstFocus"', () => {
  //   component['shortcuts'].focusOnInput = true;
  //   component.createNewDrawing();
  //   expect(component['shortcuts'].focusOnInput).toBe(false);
  // });

  it('#createNewDrawing devrait fermer la fenêtre de dialogue', () => {
    spyOn(component['dialogRef'], 'close');
    component.createNewDrawing();
    expect(component['dialogRef'].close).toHaveBeenCalled();
  });

  it('#createNewDrawing devrait changer la page actuelle à l\'aide du router vers celle de dessin', () => {
    spyOn(component['router'], 'navigate');
    component.createNewDrawing();
    expect(component['router'].navigate).toHaveBeenCalledWith(['dessin']);
  });

  it('#createNewDrawing ne devrait rien faire si areDimensionsValid retourne false', () => {
    spyOn(component, 'areDimensionsValid').and.returnValue(false);
    const spy = spyOn(component['svgStockage'], 'cleanDrawing');
    component.createNewDrawing();
    expect(spy).not.toHaveBeenCalled();
  });

  // TESTS #selectColor

  it('#selectColor devrait appeler dialog.open avec les bons paramètres', () => {
    spyOn(component['dialog'], 'open').and.returnValue(injector.get(MatDialogRef));

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    component.selectColor();

    expect(component['dialog'].open).toHaveBeenCalledWith(ColorChoiceComponent, dialogConfig);
  });

  it('#selectColor devrait assigner BackgroundNewDrawing à la portée du ColorChoiceComponent', () => {
    spyOn(component['dialog'], 'open').and.returnValue(injector.get(MatDialogRef));
    component.selectColor();
    expect(component['colorWindow'].scope).toEqual(Scope.BackgroundNewDrawing);
  });

  // TESTS getHeightClass

  it('#getHeightClass devrait retourner un string vide si heightValid est true', () => {
    component['heightValid'] = true;
    expect(component.getHeightClass()).toBe('');
  });

  it('#getHeightClass devrait retourner invalid si heightValid est false', () => {
    component['heightValid'] = false;
    expect(component.getHeightClass()).toBe('invalid');
  });

  it('#getWidthClass devrait retourner un string vide si widthValid est true', () => {
    component['widthValid'] = true;
    expect(component.getWidthClass()).toBe('');
  });

  it('#getWidthClass devrait retourner invalid si widthValid est false', () => {
    component['widthValid'] = false;
    expect(component.getWidthClass()).toBe('invalid');
  });

});
