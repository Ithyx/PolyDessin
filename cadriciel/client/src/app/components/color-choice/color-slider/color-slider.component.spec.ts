import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorManagerService } from 'src/app/services/color/color-manager.service';
import { ColorParameterService } from 'src/app/services/color/color-parameter.service';
import { CommandManagerService } from 'src/app/services/command/command-manager.service';
import { ColorSliderComponent } from './color-slider.component';

describe('GlissiereCouleurComponent', () => {
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
    component.colorManager = new ColorManagerService(new ColorParameterService(), commandes)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test ngAfterViewInit
  it('#ngAferViewInit devrait valider le draw', () => {
      spyOn(component, 'draw');
      component.ngAfterViewInit();
      expect(component.draw).toHaveBeenCalled();
  });

  // Test couleurEmise
  it('#couleurEmise devrait emettre la bonne couleur', () => {
    spyOn(component, 'colorPosition');
    component.emittedColor(25, 25);
    expect(component.colorPosition).toHaveBeenCalledWith(25, 25);
  });

  // Test sourisRelache

  it('#sourisRelache devrait mettre a jour la variable sourisbas a faux', () => {
    component.onMouseRelease(new MouseEvent('mousedown'));
    spyOn(component, 'draw');
    component.onMouseMove(new MouseEvent('mousemove'));
    expect(component.draw).not.toHaveBeenCalled();
  });

  // Test sourisEnfoncee

  it('#sourisEnfoncee devrait mettre a jour la variable souris bas a vrai', () => {

    component.onMousePress(new MouseEvent ('mousedown'));
    spyOn(component, 'draw');
    component.onMouseMove(new MouseEvent ('mousemove'));
    expect(component.draw).toHaveBeenCalled();
  });

  it('#sourisEnfoncee devrait changer la hauteur choisie', () => {
    component.onMousePress(new MouseEvent('mousedown', {clientY: 35}));
    expect(component.chosenHeight).toBe(35);
  });

  it('#sourisEnfoncee devrait valider le draw', () => {
    spyOn(component, 'draw');
    component.ngAfterViewInit();
    expect(component.draw).toHaveBeenCalled();
  });

  it('#sourisEnfoncee devrait appeler colorPosition sur les coordonnées donner', () => {
    spyOn(component, 'colorPosition');
    component.onMousePress(new MouseEvent('mousedown', {clientX: 15, clientY: 15}));
    expect(component.colorPosition).toHaveBeenCalledWith(15, 15);
  });

  // Test sourisDeplacee

  it('#sourisDeplacee devrait changer la hauteur choisie', () => {
    component.onMousePress(new MouseEvent('mousedown', {clientY: 35}));
    expect(component.chosenHeight).toBe(35);
  });

  it('#sourisDeplacee devrait valider le draw', () => {
    spyOn(component, 'draw');
    component.ngAfterViewInit();
    expect(component.draw).toHaveBeenCalled();
  });

  it('#sourisDeplacee devrait appeler colorPosition sur les coordonnées donner', () => {
    spyOn(component, 'colorPosition');
    component.onMousePress(new MouseEvent('mousedown', {clientX: 15, clientY: 15}));
    expect(component.colorPosition).toHaveBeenCalledWith(15, 15);
  });

  // Test colorPosition

  it('#colorPosition devrait actualiser la couleur du service gestionnaireCouleur', () => {
    component.colorManager.hue = 'rgba(50, 50, 50,';
    component.draw();
    component.colorPosition(0, 0);
    expect(component.colorManager.color).toBe('rgba(255,3,0,');
  });

  it('#colorPosition devrait actualiser le RGB du service gestionnaireCouleur', () => {
    component.colorManager.hue = 'rgba(50, 50, 50,';
    component.draw();
    component.colorPosition(0, 0);
    expect(component.colorManager.RGB).toEqual([255, 3, 0]);
  });

});
