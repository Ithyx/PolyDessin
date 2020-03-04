import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { GridOptionsComponent, KEY_FORM_CELL_SIZE, KEY_FORM_OPACITY, KEY_FORM_SHOW_GRID } from './grid-options.component';

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
    component.shortcuts.focusOnInput = true;
    component.closeWindow();
    expect(component.shortcuts.focusOnInput).toBe(false);
  });

  it('#closeWindow devrait appeler la fonction close de dialogRef', () => {
    spyOn(component.dialogRef, 'close');
    component.closeWindow();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  // TESTS confirmOptions

  it('#confirmOptions devrait mettre à jour opacity', () => {
    component.grid.opacity = 0;
    component.confirmOptions();
    expect(component.grid.opacity).toEqual(component.options.value[KEY_FORM_OPACITY]);
  });

  it('#confirmOptions devrait mettre à jour showGrid', () => {
    component.grid.showGrid = true;
    component.confirmOptions();
    expect(component.grid.showGrid).toEqual(component.options.value[KEY_FORM_SHOW_GRID]);
  });

  it('#confirmOptions devrait mettre à jour cellSize', () => {
    component.grid.cellSize = 0;
    component.confirmOptions();
    expect(component.grid.cellSize).toEqual(component.options.value[KEY_FORM_CELL_SIZE]);
  });

  // TESTS changeOpacity
/*
  it('#changeOpacity devrait changer la valeur de opacitySelected', () => {
    const event = fixture.debugElement.query(By.css('input[type="range"]')).nativeElement;
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    // tslint:disable-next-line:no-magic-numbers
    const test = Math.round(100 * Number(eventCast.value));
    component.changeOpacity(event);
    expect(component.opacitySelected).toEqual(test);
  });*/
});
