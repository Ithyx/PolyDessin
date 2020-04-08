import { SimpleChange, SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorManagerService } from 'src/app/services/color/color-manager.service';
import { ColorParameterService } from 'src/app/services/color/color-parameter.service';
import { CommandManagerService } from 'src/app/services/command/command-manager.service';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { LocalSaveManagerService } from 'src/app/services/saving/local/local-save-manager.service';
import { ColorPickerComponent } from './color-picker.component';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;
  let commandes: CommandManagerService;
  let localSaving: LocalSaveManagerService;

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
    localSaving = TestBed.get(LocalSaveManagerService);
    const drawingManager = TestBed.get(DrawingManagerService);
    component['colorManager'] = new ColorManagerService(new ColorParameterService(),
                                                     commandes,
                                                     drawingManager,
                                                     localSaving);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS ngOnChanges

  it('#ngOnChanges devrait dessiner la palette si la teinte est modifiée', () => {
    component['colorManager'].hue = 'testHue';
    const change: SimpleChanges = {testHue: new SimpleChange('before', 'after', true)};
    spyOn(component, 'draw');
    component.ngOnChanges(change);
    expect(component.draw).toHaveBeenCalled();
  });

  it('#ngOnChanges devrait appeler colorPosition si chosenHeight n\'est pas nulle', () => {
    component['colorManager'].hue = 'testHue';
    const change: SimpleChanges = {testHue: new SimpleChange('before', 'after', true)};
    const height = {x: 500, y: 500};

    spyOn(component, 'colorPosition');
    component['chosenHeight'] = height;
    component.ngOnChanges(change);
    expect(component.colorPosition).toHaveBeenCalledWith(500, 500);
  });

  it('#ngOnChanges ne devrait pas appeler colorPosition si chosenHeight est undefined', () => {
    const change: SimpleChanges = {testTeinte: new SimpleChange('before', 'after', true)};

    spyOn(component, 'colorPosition');
    component.ngOnChanges(change);
    expect(component.colorPosition).not.toHaveBeenCalled();
  });

  it('#ngOnChanges ne devrait rien faire si la hue n\'est pas modifiée', () => {
    component['colorManager'].hue = 'testHue';
    spyOn(component, 'draw');
    spyOn(component, 'colorPosition');
    component.ngOnChanges({});
    expect(component.draw).not.toHaveBeenCalled();
    expect(component.colorPosition).not.toHaveBeenCalled();
  });

  // TESTS colorPosition

  it('#colorPosition devrait actualiser la couleur du colorManager', () => {
    component['colorManager'].hue = 'rgba(50, 50, 50,';
    component.draw();
    component.colorPosition(249, 0);
    expect(component['colorManager'].color.RGBAString).toBe('rgba(49, 49, 49, 1)');
  });

  it('#colorPosition devrait actualiser le RGB du colorManager', () => {
    component['colorManager'].hue = 'rgba(50, 50, 50,';
    component.draw();
    component.colorPosition(249, 0);
    expect(component['colorManager'].color.RGBA).toEqual([49, 49, 49, 1]);
  });

  // TEST emittedColor

  it('#emittedColor devrait appeler colorPosition sur les points donnés en paramètres', () => {
    spyOn(component, 'colorPosition');
    component.emittedColor(63, 27);
    expect(component.colorPosition).toHaveBeenCalledWith(63, 27);
  });

  // TEST onMouseRelease

  it('#onMouseRelease devrait mettre la variable booléenne mouseDown à false', () => {
    spyOn(component, 'draw');
    component.onMouseRelease();
    component.onMouseMove(new MouseEvent('mousemove')); // teste la valeur de mouseDown
    expect(component.draw).not.toHaveBeenCalled();
  });

  // TESTS onMousePress

  it('#onMousePress devrait mettre la variable booléenne mouseDown à true', () => {
    component.onMousePress(new MouseEvent('mousedown'));
    spyOn(component, 'draw');
    component.onMouseMove(new MouseEvent('mousemove')); // teste la valeur de mouseDown
    expect(component.draw).toHaveBeenCalled();
  });

  it('#onMousePress devrait changer la hauteur choisie', () => {
    component.onMousePress(new MouseEvent('mousedown', {clientX: 50, clientY: 50}));
    expect(component['chosenHeight']).toEqual({x: 50, y: 50});
  });

  it('#onMousePress devrait dessiner la palette de couleur', () => {
    spyOn(component, 'draw');
    component.onMousePress(new MouseEvent('mousedown'));
    expect(component.draw).toHaveBeenCalled();
  });

  it('#onMousePress devrait appeler colorPosition sur les coordonnées du clic', () => {
    spyOn(component, 'colorPosition');
    component.onMousePress(new MouseEvent('mousedown', {clientX: 35, clientY: 35}));
    expect(component.colorPosition).toHaveBeenCalledWith(35, 35);
  });

  // TESTS onMouseMove
  it('#onMouseMove devrait changer la hauteurChoisie si mouseDown est vraie', () => {
    component.onMousePress(new MouseEvent('mousedown')); // mouseDown = true;
    component.onMouseMove(new MouseEvent('mousemove', {clientX: 25, clientY: 25}));
    expect(component['chosenHeight']).toEqual({x: 25, y: 25});
  });

  it(`#onMouseMove devrait appeler emittedColor avec les coordonnées de
      la souris si moudeDown est vraie`, () => {
    spyOn(component, 'emittedColor');
    component.onMousePress(new MouseEvent('mousedown')); // mouseDown = true;
    component.onMouseMove(new MouseEvent('mousemove', {clientX: 15, clientY: 15}));
    expect(component.emittedColor).toHaveBeenCalledWith(15, 15);
  });

  // TEST ngAfterViewInit
  it('#ngAfterViewInit devrait dessiner la palette de couleurs', () => {
    spyOn(component, 'draw');
    component.ngAfterViewInit();
    expect(component.draw).toHaveBeenCalled();
  });
});
