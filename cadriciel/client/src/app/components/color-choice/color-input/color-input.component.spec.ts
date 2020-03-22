import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material';
import { By } from '@angular/platform-browser';
import { ColorManagerService } from 'src/app/services/color/color-manager.service';
import { ColorParameterService } from 'src/app/services/color/color-parameter.service';
import { CommandManagerService } from 'src/app/services/command/command-manager.service';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { ColorInputComponent } from './color-input.component';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('ColorInputComponent', () => {
  let component: ColorInputComponent;
  let fixture: ComponentFixture<ColorInputComponent>;
  let commandes: CommandManagerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorInputComponent ],
      imports: [MatDialogModule],
      providers: [ { provide: MatDialogRef, useValue: {}}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorInputComponent);
    component = fixture.componentInstance;
    commandes = TestBed.get(CommandManagerService);
    const drawingManager = TestBed.get(DrawingManagerService);
    component['colorManager'] = new ColorManagerService(new ColorParameterService(),
                                                     commandes,
                                                     drawingManager);

    fixture.detectChanges();
    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS editRGB
  it('#editRGB devrait modifier le RGB si on entre une valeur hexadécimal', () => {
    const element = fixture.debugElement.query(By.css('input[class="redHex"]')).nativeElement;
    element.value = 0xff;

    spyOn(component['colorManager'], 'updateColor');

    element.dispatchEvent(new Event('change'));

    expect(component['colorManager'].updateColor).toHaveBeenCalled();
  });

  it('#editRGB ne devrait pas modifier le RGB si on entre un string non reconnu', () => {
    const element = fixture.debugElement.query(By.css('input[class="blueHex"]')).nativeElement;
    element.value = 'test';

    spyOn(component['colorManager'], 'updateColor');

    element.dispatchEvent(new Event('change'));

    expect(component['colorManager'].updateColor).toHaveBeenCalled();
    expect(component['colorManager'].color.RGBA[component['BLUE_INDEX']]).toBe(0);
  });

  it('#editRGB ne devrait pas modifier le RGB si l\'index est non recconu', () => {
    component['BLUE_INDEX'] = 5;
    const element = fixture.debugElement.query(By.css('input[class="blueHex"]')).nativeElement;
    element.value = 0xff;

    spyOn(component['colorManager'], 'updateColor');

    element.dispatchEvent(new Event('change'));

    expect(component['colorManager'].updateColor).not.toHaveBeenCalled();
  });

  // TESTS checkInput
  it('#checkInput devrait renvoyer vrai, si on appuie sur une touche avec une lettre acceptee', () => {
    const clavier = new KeyboardEvent('keypress', { key: 'a'});
    expect(component.checkInput(clavier)).toBe(true);
  });

  it('#checkInput devrait renvoyer vrai, si on appuie sur backspace', () => {
    const clavier = new KeyboardEvent('keypress', { key: 'Backspace'});
    expect(component.checkInput(clavier)).toBe(true);
  });

  it('#checkInput devrait renvoyer vrai, si on appuie sur une touche avec un nombre acceptee', () => {
    const clavier = new KeyboardEvent('keypress', { key: '7'});
    expect(component.checkInput(clavier)).toBe(true);
  });

  it('#checkInput devrait renvoyer faux, si on appuie sur une touche avec une lettre non-acceptee', () => {
    const clavier = new KeyboardEvent('keypress', { key: 'v'});
    expect(component.checkInput(clavier)).toBe(false);
  });

  it('#checkInput devrait renvoyer faux, si on appuie sur une touche non reconnue', () => {
    const clavier = new KeyboardEvent('keypress', { key: '#'});
    expect(component.checkInput(clavier)).toBe(false);
  });

  // TEST disableShortcuts
  it('#disableShortcuts devrait activer le focus sur le champ d\'entree', () => {
    component.disableShortcuts();
    expect(component['shortcuts'].focusOnInput).toBe(true);
  });

  // TEST enableShortcuts
  it('#enableShortcuts devrait desactiver le focus sur le champ d\'entree', () => {
    component.enableShortcuts();
    expect(component['shortcuts'].focusOnInput).toBe(false);
  });

});
