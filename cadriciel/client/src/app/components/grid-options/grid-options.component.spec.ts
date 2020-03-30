import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { MAX_CELL_SIZE, MIN_CELL_SIZE } from 'src/app/services/grid/grid.service';
import { GridOptionsComponent, KEY_FORM_CELL_SIZE, KEY_FORM_OPACITY, KEY_FORM_SHOW_GRID } from './grid-options.component';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('GridOptionsComponent', () => {
  let component: GridOptionsComponent;
  let fixture: ComponentFixture<GridOptionsComponent>;

  const matDialogRefStub: Partial<MatDialogRef<GridOptionsComponent>> = {
    close(): void { /* NE RIEN FAIRE */ }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, MatDialogModule ],
      declarations: [ GridOptionsComponent ],
      providers: [ {provide: MatDialogRef, useValue: matDialogRefStub} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS closeWindow

  it('#closeWindow devrait mettre focusInput false', () => {
    component['shortcuts'].focusOnInput = true;
    component.closeWindow();
    expect(component['shortcuts'].focusOnInput).toBe(false);
  });

  it('#closeWindow devrait appeler la fonction close de dialogRef', () => {
    spyOn(component['dialogRef'], 'close');
    component.closeWindow();
    expect(component['dialogRef'].close).toHaveBeenCalled();
  });

  // TESTS confirmOptions

  it('#confirmOptions devrait mettre à jour opacity', () => {
    component['grid'].opacity = 0;
    component.confirmOptions();
    expect(component['grid'].opacity).toEqual(component['options'].value[KEY_FORM_OPACITY]);
  });

  it('#confirmOptions devrait mettre à jour showGrid', () => {
    component['grid'].showGrid = true;
    component.confirmOptions();
    expect(component['grid'].showGrid).toEqual(component['options'].value[KEY_FORM_SHOW_GRID]);
  });

  it('#confirmOptions devrait mettre à jour cellSize', () => {
    component['grid'].cellSize = 0;
    component.confirmOptions();
    expect(component['grid'].cellSize).toEqual(component['options'].value[KEY_FORM_CELL_SIZE]);
  });

  // TESTS changeOpacity

  it('#changeOpacity devrait changer la valeur de opacitySelected', () => {
    const element = fixture.debugElement.query(By.css('input[formControlName="opacityForm"]')).nativeElement;
    element.value = 0.589;
    element.dispatchEvent(new Event('input'));  // changeOpacity appelée implicitement
    expect(component['opacitySelected']).toEqual(59);
  });

  // TESTS validateCellSize

  it('#validateCellSize devrait changer la valeur de cellSizeValue', () => {
    const element = fixture.debugElement.query(By.css('input[formControlName="cellSizeForm"]')).nativeElement;
    element.value = 10;
    element.dispatchEvent(new Event('change'));  // validateCellSize appelée implicitement
    expect(component['cellSizeValue']).toEqual(10);
  });

  it('#validateCellSize devrait changer la valeur de cellSizeValue à MIN_CELL_SIZE si la valeur est inférieure', () => {
    const element = fixture.debugElement.query(By.css('input[formControlName="cellSizeForm"]')).nativeElement;
    element.value = MIN_CELL_SIZE - 10;
    element.dispatchEvent(new Event('change'));  // validateCellSize appelée implicitement
    expect(component['cellSizeValue']).toEqual(MIN_CELL_SIZE);
  });

  it('#validateCellSize devrait changer la valeur de cellSizeValue à MAX_CELL_SIZE si la valeur est supérieure', () => {
    const element = fixture.debugElement.query(By.css('input[formControlName="cellSizeForm"]')).nativeElement;
    element.value = MAX_CELL_SIZE + 10;
    element.dispatchEvent(new Event('change'));  // validateCellSize appelée implicitement
    expect(component['cellSizeValue']).toEqual(MAX_CELL_SIZE);
  });

  it('#validateCellSize devrait changer la valeur dans options', () => {
    const element = fixture.debugElement.query(By.css('input[formControlName="cellSizeForm"]')).nativeElement;
    element.value = 25;
    element.dispatchEvent(new Event('change'));  // validateCellSize appelée implicitement
    expect(component['options'].value[KEY_FORM_CELL_SIZE]).toEqual(25);
  });
});
