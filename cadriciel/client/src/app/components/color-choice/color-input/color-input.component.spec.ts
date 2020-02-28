import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ColorManagerService } from 'src/app/services/color/color-manager.service';
import { ColorParameterService } from 'src/app/services/color/color-parameter.service';
import { CommandManagerService } from 'src/app/services/command/command-manager.service';
import { ColorInputComponent } from './color-input.component';

describe('ValeurCouleurComponent', () => {
  let component: ColorInputComponent;
  let fixture: ComponentFixture<ColorInputComponent>;
  let commandes: CommandManagerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorInputComponent);
    component = fixture.componentInstance;
    commandes = TestBed.get(CommandManagerService);
    component.colorManager = new ColorManagerService(new ColorParameterService(), commandes);

    fixture.detectChanges();
    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS modificationRGB
  it('#modificationRGB devrait modifier le RGB si on entre une valeur hexadécimal', () => {
    const element = fixture.debugElement.query(By.css('input[class="hexRouge"]')).nativeElement;
    element.value = 0xff;

    spyOn(component.colorManager, 'editRGB');

    element.dispatchEvent(new Event('change'));

    expect(component.colorManager.editRGB).toHaveBeenCalled();
    expect(component.colorManager.RGB[component.RED_INDEX]).toBe(255);
  });

  it('#modificationRGB devrait modifier le RGB si on entre un string non reconnu', () => {
    const element = fixture.debugElement.query(By.css('input[class="hexBleu"]')).nativeElement;
    element.value = 'test';

    spyOn(component.colorManager, 'editRGB');

    element.dispatchEvent(new Event('change'));

    expect(component.colorManager.editRGB).toHaveBeenCalled();
    expect(component.colorManager.RGB[component.BLUE_INDEX]).toBe(0);
  });

  it('#modificationRGB ne devrait pas modifier le RGB si l\'index est non recconu', () => {
    component.BLUE_INDEX = 5;
    const element = fixture.debugElement.query(By.css('input[class="hexBleu"]')).nativeElement;
    element.value = 0xff;

    spyOn(component.colorManager, 'editRGB');

    element.dispatchEvent(new Event('change'));

    expect(component.colorManager.editRGB).not.toHaveBeenCalled();
  });

  // TESTS verifierEntree
  it('#verifierEntree devrait renvoyer vrai, si on appuie sur une touche avec une lettre acceptee', () => {
    const clavier = new KeyboardEvent('keypress', { key: 'a'});
    expect(component.checkInput(clavier)).toBe(true);
  });

  it('#verifierEntree devrait renvoyer vrai, si on appuie sur backspace', () => {
    const clavier = new KeyboardEvent('keypress', { key: 'Backspace'});
    expect(component.checkInput(clavier)).toBe(true);
  });

  it('#verifierEntree devrait renvoyer vrai, si on appuie sur une touche avec un nombre acceptee', () => {
    const clavier = new KeyboardEvent('keypress', { key: '7'});
    expect(component.checkInput(clavier)).toBe(true);
  });

  it('#verifierEntree devrait renvoyer faux, si on appuie sur une touche avec une lettre non-acceptee', () => {
    const clavier = new KeyboardEvent('keypress', { key: 'v'});
    expect(component.checkInput(clavier)).toBe(false);
  });

  it('#verifierEntree devrait renvoyer faux, si on appuie sur une touche non reconnue', () => {
    const clavier = new KeyboardEvent('keypress', { key: '#'});
    expect(component.checkInput(clavier)).toBe(false);
  });

  // TEST desactiverRaccourcis
  it('#activerRaccourcis devrait activer le focus sur le champ d\'entree', () => {
    component.disableShortcuts();
    expect(component.shortcuts.focusOnInput).toBe(true);
  });

  // TEST activerRaccourcis
  it('#activerRaccourcis devrait desactiver le focus sur le champ d\'entree', () => {
    component.enableShortcuts();
    expect(component.shortcuts.focusOnInput).toBe(false);
  });

});
