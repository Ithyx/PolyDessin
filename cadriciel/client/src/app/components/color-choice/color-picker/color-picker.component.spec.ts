/* import { SimpleChange, SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorManagerService } from 'src/app/services/color/color-manager.service';
import { ColorParameterService } from 'src/app/services/color/color-parameter.service';
import { CommandManagerService } from 'src/app/services/command/command-manager.service';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { ColorPickerComponent } from './color-picker.component';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('color-picker', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;
  let commandes: CommandManagerService;
  const changementsTeinte: SimpleChanges = {testTeinte: new SimpleChange('avant', 'après', true)};
  const hauteurTest = {x: 500, y: 500};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    commandes = TestBed.get(CommandManagerService);
    const drawingManager = TestBed.get(DrawingManagerService);
    component.colorManager = new ColorManagerService(new ColorParameterService(),
                                                     commandes,
                                                     drawingManager);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS ngOnChanges

  it('#ngOnChanges devrait dessiner la palette si la teinte est modifiée', () => {
    component.colorManager.hue = 'testTeinte';
    spyOn(component, 'draw');
    component.ngOnChanges(changementsTeinte);
    expect(component.draw).toHaveBeenCalled();
  });

  it('#ngOnChanges devrait appeler colorPosition si hauteurChoisie n\'est pas nulle', () => {
    component.colorManager.hue = 'testTeinte';
    spyOn(component, 'colorPosition');
    component.chosenHeight = hauteurTest;
    component.ngOnChanges(changementsTeinte);
    expect(component.colorPosition).toHaveBeenCalledWith(500, 500);
  });

  it('#ngOnChanges ne devrait pas appeler colorPosition si hauteurChoisie est undefined', () => {
    spyOn(component, 'colorPosition');
    component.ngOnChanges(changementsTeinte);
    expect(component.colorPosition).not.toHaveBeenCalled();
  });

  it('#ngOnChanges ne devrait rien faire si la teinte n\'est pas modifiée', () => {
    component.colorManager.hue = 'testTeinte';
    spyOn(component, 'draw');
    spyOn(component, 'colorPosition');
    component.ngOnChanges({});
    expect(component.draw).not.toHaveBeenCalled();
    expect(component.colorPosition).not.toHaveBeenCalled();
  });

  // TESTS colorPosition / dessin

  it('#colorPosition devrait actualiser la couleur du service gestionnaireCouleur', () => {
    component.colorManager.hue = 'rgba(50, 50, 50,';
    component.draw();
    component.colorPosition(249, 0);
    expect(component.colorManager.color.RGBAString).toBe('rgba(49,49,49,');
  });

  it('#colorPosition devrait actualiser le RGB du service gestionnaireCouleur', () => {
    component.colorManager.hue = 'rgba(50, 50, 50,';
    component.draw();
    component.colorPosition(249, 0);
    // expect(component.colorManager.RGB).toEqual([49, 49, 49]);
    expect(component.colorManager.color.RGBA).toEqual([49, 49, 49]);  // À vérifier
  });

  // TEST couleurEmise

  it('#couleurEmise devrait appeler colorPosition sur les points donnés en paramètres', () => {
    spyOn(component, 'colorPosition');
    component.emittedColor(63, 27);
    expect(component.colorPosition).toHaveBeenCalledWith(63, 27);
  });

  // TEST sourisRelachee

  it('#sourisRelachee devrait mettre la variable booléenne sourisBas à false', () => {
    spyOn(component, 'draw');
    component.onMouseRelease(new MouseEvent('mousedown'));
    component.onMouseMove(new MouseEvent('mousemove')); // teste la valeur de sourisBas
    expect(component.draw).not.toHaveBeenCalled();
  });

  // TESTS sourisEnfoncee

  it('#sourisEnfoncee devrait mettre la variable booléenne sourisBas à true', () => {
    component.onMousePress(new MouseEvent('mousedown'));
    spyOn(component, 'draw');
    component.onMouseMove(new MouseEvent('mousemove')); // teste la valeur de sourisBas
    expect(component.draw).toHaveBeenCalled();
  });

  it('#sourisEnfoncee devrait changer la hauteur choisie', () => {
    component.onMousePress(new MouseEvent('mousedown', {clientX: 50, clientY: 50}));
    expect(component.chosenHeight).toEqual({x: 50, y: 50});
  });

  it('#sourisEnfoncee devrait dessiner la palette de couleur', () => {
    spyOn(component, 'draw');
    component.onMousePress(new MouseEvent('mousedown'));
    expect(component.draw).toHaveBeenCalled();
  });

  it('#sourisEnfoncee devrait appeler colorPosition sur les coordonnées du clic', () => {
    spyOn(component, 'colorPosition');
    component.onMousePress(new MouseEvent('mousedown', {clientX: 35, clientY: 35}));
    expect(component.colorPosition).toHaveBeenCalledWith(35, 35);
  });

  // TESTS sourisDeplacee
  it('#sourisDeplacee devrait changer la hauteurChoisie si sourisBas est vraie', () => {
    component.onMousePress(new MouseEvent('mousedown')); // sourisBas = true;
    component.onMouseMove(new MouseEvent('mousemove', {clientX: 25, clientY: 25}));
    expect(component.chosenHeight).toEqual({x: 25, y: 25});
  });

  it('#sourisDeplacee devrait appeler couleurEmise avec les coordonnées de ' +
    'la souris si sourisBas est vraie', () => {
    spyOn(component, 'emittedColor');
    component.onMousePress(new MouseEvent('mousedown')); // sourisBas = true;
    component.onMouseMove(new MouseEvent('mousemove', {clientX: 15, clientY: 15}));
    expect(component.emittedColor).toHaveBeenCalledWith(15, 15);
  });

  // TEST ngAfterViewInit
  it('#ngAfterViewInit devrait dessiner la palette de couleurs', () => {
    spyOn(component, 'draw');
    component.ngAfterViewInit();
    expect(component.draw).toHaveBeenCalled();
  });
}); */
