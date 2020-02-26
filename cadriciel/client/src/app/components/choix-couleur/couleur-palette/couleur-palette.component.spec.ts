import { SimpleChange, SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionnaireCommandesService } from 'src/app/services/commande/gestionnaire-commandes.service';
import { GestionnaireCouleursService } from 'src/app/services/couleur/color-manager.service';
import { ParametresCouleurService } from 'src/app/services/couleur/color-parameter.service';
import { CouleurPaletteComponent } from './couleur-palette.component';

describe('CouleurPaletteComponent', () => {
  let component: CouleurPaletteComponent;
  let fixture: ComponentFixture<CouleurPaletteComponent>;
  let parametresCouleur: ParametresCouleurService;
  let commandes: GestionnaireCommandesService;
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
    commandes = TestBed.get(GestionnaireCommandesService);
    component.gestionnaireCouleur = new GestionnaireCouleursService(parametresCouleur, commandes);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS ngOnChanges

  it('#ngOnChanges devrait dessiner la palette si la teinte est modifiée', () => {
    component.gestionnaireCouleur.teinte = 'testTeinte';
    spyOn(component, 'dessin');
    component.ngOnChanges(changementsTeinte);
    expect(component.dessin).toHaveBeenCalled();
  });

  it('#ngOnChanges devrait appeler couleurPosition si hauteurChoisie n\'est pas nulle', () => {
    component.gestionnaireCouleur.teinte = 'testTeinte';
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
    component.gestionnaireCouleur.teinte = 'testTeinte';
    spyOn(component, 'dessin');
    spyOn(component, 'couleurPosition');
    component.ngOnChanges({});
    expect(component.dessin).not.toHaveBeenCalled();
    expect(component.couleurPosition).not.toHaveBeenCalled();
  });

  // TESTS couleurPosition / dessin

  it('#couleurPosition devrait actualiser la couleur du service gestionnaireCouleur', () => {
    component.gestionnaireCouleur.teinte = 'rgba(50, 50, 50,';
    component.dessin();
    component.couleurPosition(249, 0);
    expect(component.gestionnaireCouleur.couleur).toBe('rgba(49,49,49,');
  });

  it('#couleurPosition devrait actualiser le RGB du service gestionnaireCouleur', () => {
    component.gestionnaireCouleur.teinte = 'rgba(50, 50, 50,';
    component.dessin();
    component.couleurPosition(249, 0);
    expect(component.gestionnaireCouleur.RGB).toEqual([49, 49, 49]);
  });

  // TEST couleurEmise

  it('#couleurEmise devrait appeler couleurPosition sur les points donnés en paramètres', () => {
    spyOn(component, 'couleurPosition');
    component.couleurEmise(63, 27);
    expect(component.couleurPosition).toHaveBeenCalledWith(63, 27);
  });

  // TEST sourisRelachee

  it('#sourisRelachee devrait mettre la variable booléenne sourisBas à false', () => {
    spyOn(component, 'dessin');
    component.onMouseRelease(new MouseEvent('mousedown'));
    component.onMouseMove(new MouseEvent('mousemove')); // teste la valeur de sourisBas
    expect(component.dessin).not.toHaveBeenCalled();
  });

  // TESTS sourisEnfoncee

  it('#sourisEnfoncee devrait mettre la variable booléenne sourisBas à true', () => {
    component.onMousePress(new MouseEvent('mousedown'));
    spyOn(component, 'dessin');
    component.onMouseMove(new MouseEvent('mousemove')); // teste la valeur de sourisBas
    expect(component.dessin).toHaveBeenCalled();
  });

  it('#sourisEnfoncee devrait changer la hauteur choisie', () => {
    component.onMousePress(new MouseEvent('mousedown', {clientX: 50, clientY: 50}));
    expect(component.hauteurChoisie).toEqual({x: 50, y: 50});
  });

  it('#sourisEnfoncee devrait dessiner la palette de couleur', () => {
    spyOn(component, 'dessin')
    component.onMousePress(new MouseEvent('mousedown'));
    expect(component.dessin).toHaveBeenCalled();
  });

  it('#sourisEnfoncee devrait appeler couleurPosition sur les coordonnées du clic', () => {
    spyOn(component, 'couleurPosition')
    component.onMousePress(new MouseEvent('mousedown', {clientX: 35, clientY: 35}));
    expect(component.couleurPosition).toHaveBeenCalledWith(35, 35);
  });

  // TESTS sourisDeplacee
  it('#sourisDeplacee devrait changer la hauteurChoisie si sourisBas est vraie', () => {
    component.onMousePress(new MouseEvent('mousedown')); // sourisBas = true;
    component.onMouseMove(new MouseEvent('mousemove', {clientX: 25, clientY: 25}));
    expect(component.hauteurChoisie).toEqual({x: 25, y: 25});
  });

  it('#sourisDeplacee devrait appeler couleurEmise avec les coordonnées de ' +
    'la souris si sourisBas est vraie', () => {
    spyOn(component, 'couleurEmise');
    component.onMousePress(new MouseEvent('mousedown')); // sourisBas = true;
    component.onMouseMove(new MouseEvent('mousemove', {clientX: 15, clientY: 15}));
    expect(component.couleurEmise).toHaveBeenCalledWith(15, 15);
  });

  // TEST ngAfterViewInit
  it('#ngAfterViewInit devrait dessiner la palette de couleurs', () => {
    spyOn(component, 'dessin');
    component.ngAfterViewInit();
    expect(component.dessin).toHaveBeenCalled();
  });
});
