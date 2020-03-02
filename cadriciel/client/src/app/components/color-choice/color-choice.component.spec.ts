import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material';

import { Scope } from 'src/app/services/color/color-manager.service';
import { ColorParameterService } from 'src/app/services/color/color-parameter.service';
import { ColorChoiceComponent } from './color-choice.component';
import { ColorInputComponent } from './color-input/color-input.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { ColorSliderComponent } from './color-slider/color-slider.component';

const matDialogRefStub: Partial<MatDialogRef<ColorChoiceComponent>> = {
  close(): void { /* NE RIEN FAIRE */ }
};

describe('ChoixCouleurComponent', () => {
  let component: ColorChoiceComponent;
  let fixture: ComponentFixture<ColorChoiceComponent>;
  let color: ColorParameterService;
  const COLOR_TEST = 'rgba(20, 20, 20, 1)';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorChoiceComponent, ColorPickerComponent, ColorSliderComponent,
        ColorInputComponent ],
      providers: [ { provide: MatDialogRef, useValue: matDialogRefStub } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    color = TestBed.get(ColorParameterService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS closeWindow

  it('#closeWindow devrait fermer le popup', () => {
    spyOn(component.dialogRef, 'close');
    component.closeWindow();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  // TESTS applyColor

  it('#applyColor should apply primary color', () => {
    component.colorManager.color = COLOR_TEST;
    component.portee = Scope.Primary;
    component.applyColor();
    expect(color.primaryColor).toBe(COLOR_TEST);
  });

  it('#applyColor should apply secondary color', () => {
    component.colorManager.color = COLOR_TEST;
    component.portee = Scope.Secondary;
    component.applyColor();
    expect(color.secondaryColor).toBe(COLOR_TEST);
  });

  it('#applyColor should apply background color', () => {
    component.colorManager.color = COLOR_TEST.slice(0, -2);
    component.portee = Scope.Background;
    component.applyColor();
    expect(color.temporaryBackgroundColor).toBe(COLOR_TEST);
  });

  it('#applyColor should close the popup', () => {
    spyOn(component.dialogRef, 'close');
    component.applyColor();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });
});
