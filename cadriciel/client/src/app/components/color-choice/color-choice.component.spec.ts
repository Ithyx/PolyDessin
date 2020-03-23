import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material';

import { ColorChoiceComponent } from './color-choice.component';
import { ColorInputComponent } from './color-input/color-input.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { ColorSliderComponent } from './color-slider/color-slider.component';

// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers

describe('ColorChoiceComponent', () => {
  let component: ColorChoiceComponent;
  let fixture: ComponentFixture<ColorChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorChoiceComponent, ColorPickerComponent, ColorSliderComponent,
        ColorInputComponent ],
      imports: [MatDialogModule],
      providers: [ { provide: MatDialogRef, useValue: {close: () => { return; }} } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TEST closeWindow

  it('#closeWindow devrait fermer le popup', () => {
    spyOn(component['dialogRef'], 'close');
    component.closeWindow();
    expect(component['dialogRef'].close).toHaveBeenCalled();
  });

  // TESTS applyColor

  it('#applyColor devrait demander de modifier la couleur avec le Scope donnée', () => {
    spyOn(component['colorManager'], 'applyColor');
    component.applyColor();
    expect(component['colorManager'].applyColor).toHaveBeenCalled();
  });

  it('#applyColor devrait fermer le popup', () => {
    spyOn(component['dialogRef'], 'close');
    component.applyColor();
    expect(component['dialogRef'].close).toHaveBeenCalled();
  });

});
