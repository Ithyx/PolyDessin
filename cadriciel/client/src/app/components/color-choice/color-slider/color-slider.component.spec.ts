import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorManagerService } from 'src/app/services/color/color-manager.service';
import { ColorParameterService } from 'src/app/services/color/color-parameter.service';
import { CommandManagerService } from 'src/app/services/command/command-manager.service';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { ColorSliderComponent } from './color-slider.component';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('ColorSliderComponent', () => {
  let component: ColorSliderComponent;
  let fixture: ComponentFixture<ColorSliderComponent>;
  let commandes: CommandManagerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorSliderComponent, ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorSliderComponent);
    component = fixture.componentInstance;
    commandes = TestBed.get(CommandManagerService);
    fixture.detectChanges();
    const drawingManager = TestBed.get(DrawingManagerService);
    component['colorManager'] = new ColorManagerService(new ColorParameterService(),
                                                     commandes,
                                                     drawingManager);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test ngAfterViewInit
  it('#ngAferViewInit devrait appeler draw', () => {
      spyOn(component, 'draw');
      component.ngAfterViewInit();
      expect(component.draw).toHaveBeenCalled();
  });

  // Test emittedColor
  it('#emittedColor devrait emettre la bonne couleur', () => {
    spyOn(component, 'colorPosition');
    component.emittedColor(25, 25);
    expect(component.colorPosition).toHaveBeenCalledWith(25, 25);
  });

  // Test onMouseRelease

  it('#onMouseRelease devrait mettre a jour la variable sourisbas a faux', () => {
    spyOn(component, 'draw');
    component.onMouseMove(new MouseEvent('mousemove'));
    component.onMouseRelease();
    expect(component.draw).not.toHaveBeenCalled();
  });

  // Test onMousePress

  it('#onMousePress devrait mettre a jour la variable souris bas a vrai', () => {

    component.onMousePress(new MouseEvent ('mousedown'));
    spyOn(component, 'draw');
    component.onMouseMove(new MouseEvent ('mousemove'));
    expect(component.draw).toHaveBeenCalled();
  });

  it('#onMousePress devrait changer la hauteur choisie', () => {
    component.onMousePress(new MouseEvent('mousedown', {clientY: 35}));
    expect(component['chosenHeight']).toBe(35);
  });

  it('#onMousePress devrait valider le draw', () => {
    spyOn(component, 'draw');
    component.ngAfterViewInit();
    expect(component.draw).toHaveBeenCalled();
  });

  it('#onMousePress devrait appeler colorPosition sur les coordonnées donner', () => {
    spyOn(component, 'colorPosition');
    component.onMousePress(new MouseEvent('mousedown', {clientX: 15, clientY: 15}));
    expect(component.colorPosition).toHaveBeenCalledWith(15, 15);
  });

  // Test onMouseMove

  it('#onMouseMove devrait changer la hauteur choisie', () => {
    component.onMousePress(new MouseEvent('mousedown', {clientY: 35}));
    expect(component['chosenHeight']).toBe(35);
  });

  it('#onMouseMove devrait valider le draw', () => {
    spyOn(component, 'draw');
    component.ngAfterViewInit();
    expect(component.draw).toHaveBeenCalled();
  });

  it('#onMouseMove devrait appeler colorPosition sur les coordonnées donner', () => {
    spyOn(component, 'colorPosition');
    component.onMousePress(new MouseEvent('mousedown', {clientX: 15, clientY: 15}));
    expect(component.colorPosition).toHaveBeenCalledWith(15, 15);
  });

  // Test colorPosition

  it('#colorPosition devrait actualiser la couleur du service gestionnaireCouleur', () => {
    component['colorManager'].hue = 'rgba(50, 50, 50,';
    component.draw();
    component.colorPosition(0, 0);
    expect(component['colorManager'].color.RGBAString).toBe('rgba(255, 3, 0, 1)');
  });

  it('#colorPosition devrait actualiser le RGB du service gestionnaireCouleur', () => {
    component['colorManager'].hue = 'rgba(50, 50, 50,';
    component.draw();
    component.colorPosition(0, 0);
    expect(component['colorManager'].color.RGBA).toEqual([255, 3, 0, 1]);
  });

});
