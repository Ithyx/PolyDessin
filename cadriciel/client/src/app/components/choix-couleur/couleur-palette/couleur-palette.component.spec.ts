import { SimpleChange, SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionnaireCouleursService } from 'src/app/services/couleur/gestionnaire-couleurs.service';
import { ParametresCouleurService } from 'src/app/services/couleur/parametres-couleur.service';
import { CouleurPaletteComponent } from './couleur-palette.component';

describe('CouleurPaletteComponent', () => {
  let component: CouleurPaletteComponent;
  let fixture: ComponentFixture<CouleurPaletteComponent>;
  let parametresCouleur: ParametresCouleurService;
  const changementsTeinte: SimpleChanges = {testTeinte: new SimpleChange('avant', 'après', true)};
  const hauteurTest = {x: 500, y: 500};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouleurPaletteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouleurPaletteComponent);
    component = fixture.componentInstance;
    parametresCouleur = TestBed.get(ParametresCouleurService);
    component.gestionnaireCouleur = new GestionnaireCouleursService(parametresCouleur);
    component.gestionnaireCouleur.teinte = 'testTeinte';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS ngOnChanges

  it('#ngOnChanges devrait dessiner la palette si la teinte est modifiée', () => {
    spyOn(component, 'draw');
    component.ngOnChanges(changementsTeinte);
    expect(component.draw).toHaveBeenCalled();
  });

  it('#ngOnChanges devrait appeler couleurPosition si hauteurChoisie n\'est pas nulle', () => {
    spyOn(component, 'couleurPosition');
    component.hauteurChoisie = hauteurTest;
    component.ngOnChanges(changementsTeinte);
    expect(component.couleurPosition).toHaveBeenCalledWith(500, 500);
  });

  it('#ngOnChanges ne devrait pas appeler couleurPosition si hauteurChoisie est undefined', () => {
    spyOn(component, 'couleurPosition');
    component.ngOnChanges(changementsTeinte);
    expect(component.couleurPosition).not.toHaveBeenCalled();
  });

  it('#ngOnChanges ne devrait rien faire si la teinte n\'est pas modifiée', () => {
    spyOn(component, 'draw');
    spyOn(component, 'couleurPosition');
    component.ngOnChanges({});
    expect(component.draw).not.toHaveBeenCalled();
    expect(component.couleurPosition).not.toHaveBeenCalled();
  });

  // TEST couleurEmise

  it('#couleurEmise devrait appeler couleurPosition sur les points donnés en paramètres', () => {
    spyOn(component, 'couleurPosition');
    component.couleurEmise(63, 27);
    expect(component.couleurPosition).toHaveBeenCalledWith(63, 27);
  });

  // TEST sourisRelachee

  it('#sourisRelachee devrait mettre la variable booléenne sourisBas à false', () => {
    spyOn(component, 'draw');
    component.sourisRelachee(new MouseEvent('mousedown'));
    component.sourisDeplacee(new MouseEvent('mousemove')); // teste la valeur de sourisBas
    expect(component.draw).not.toHaveBeenCalled();
  });

  // TESTS sourisEnfoncee

  it('#sourisEnfoncee devrait mettre la variable booléenne sourisBas à true', () => {
    component.sourisEnfoncee(new MouseEvent('mousedown'));
    spyOn(component, 'draw');
    component.sourisDeplacee(new MouseEvent('mousemove')); // teste la valeur de sourisBas
    expect(component.draw).toHaveBeenCalled();
  });

  it('#sourisEnfoncee devrait changer la hauteur choisie', () => {
    component.sourisEnfoncee(new MouseEvent('mousedown', {clientX: 50, clientY: 50}));
    expect(component.hauteurChoisie).toEqual({x: 50, y: 50});
  });

  it('#sourisEnfoncee devrait dessiner la palette de couleur', () => {
    spyOn(component, 'draw')
    component.sourisEnfoncee(new MouseEvent('mousedown'));
    expect(component.draw).toHaveBeenCalled();
  });

  it('#sourisEnfoncee devrait appeler couleurPosition sur les coordonnées du clic', () => {
    spyOn(component, 'couleurPosition')
    component.sourisEnfoncee(new MouseEvent('mousedown', {clientX: 35, clientY: 35}));
    expect(component.couleurPosition).toHaveBeenCalledWith(35, 35);
  });

  // TESTS sourisDeplacee
  it('#sourisDeplacee devrait changer la hauteurChoisie si sourisBas est vraie', () => {
    component.sourisEnfoncee(new MouseEvent('mousedown')); // sourisBas = true;
    component.sourisDeplacee(new MouseEvent('mousemove', {clientX: 25, clientY: 25}));
    expect(component.hauteurChoisie).toEqual({x: 25, y: 25});
  });

  it('#sourisDeplacee devrait appeler couleurEmise avec les coordonnées de ' +
    'la souris si sourisBas est vraie', () => {
    spyOn(component, 'couleurEmise');
    component.sourisEnfoncee(new MouseEvent('mousedown')); // sourisBas = true;
    component.sourisDeplacee(new MouseEvent('mousemove', {clientX: 15, clientY: 15}));
    expect(component.couleurEmise).toHaveBeenCalledWith(15, 15);
  });

  // TEST ngAfterViewInit
  it('#ngAfterViewInit devrait dessiner la palette de couleurs', () => {
    spyOn(component, 'draw');
    component.ngAfterViewInit();
    expect(component.draw).toHaveBeenCalled();
  })
});
