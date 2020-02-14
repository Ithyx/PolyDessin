import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionnaireCouleursService } from 'src/app/services/couleur/gestionnaire-couleurs.service';
import { ParametresCouleurService } from 'src/app/services/couleur/parametres-couleur.service';
import { GlissiereCouleurComponent } from './glissiere-couleur.component';

describe('GlissiereCouleurComponent', () => {
  let component: GlissiereCouleurComponent;
  let fixture: ComponentFixture<GlissiereCouleurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlissiereCouleurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlissiereCouleurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.gestionnaireCouleur = new GestionnaireCouleursService(new ParametresCouleurService())
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test ngAfterViewInit
  it('#ngAferViewInit devrait valider le dessin', () => {
      spyOn(component, 'draw');
      component.ngAfterViewInit();
      expect(component.draw).toHaveBeenCalled();
  });

  // Test couleurEmise
  it('#couleurEmise devrait emettre la bonne couleur', () => {
    spyOn(component, 'couleurPosition');
    component.couleurEmise(25, 25);
    expect(component.couleurPosition).toHaveBeenCalledWith(25, 25);
  });

  // Test sourisRelache
  it('#sourisRelache devrait mettre a jour la variable sourisbas a faux', () => {
    spyOn(component, 'draw');
    component.sourisRelachee(new MouseEvent('mousedown'));
    component.sourisDeplacee(new MouseEvent('mousemove')); // teste la valeur de sourisBas
    expect(component.draw).not.toHaveBeenCalled();
  });

  // Test sourisEnfoncee
  it('#sourisEnfoncee devrait mettre a jour la variable souris bas a vrai', () => {
    component.sourisEnfoncee(new MouseEvent ('mousedown'));
    spyOn(component, 'draw');
    component.sourisDeplacee(new MouseEvent ('mousemove'));
    expect(component.draw).toHaveBeenCalled();
  });

  it('#sourisEnfoncee devrait changer la hauteur choisie', () => {
    component.sourisEnfoncee(new MouseEvent('mousedown', {clientY : 15}));
    expect(component.hauteurChoisi).toEqual(15);
  });

  it('#sourisEnfoncee devrait valider le dessin', () => {
    spyOn(component, 'draw');
    component.ngAfterViewInit();
    expect(component.draw).toHaveBeenCalled();
  });

  it('#sourisEnfoncee devrait appeler couleurPosition sur les coordonnées donner', () => {
    spyOn(component, 'couleurPosition');
    component.sourisEnfoncee(new MouseEvent('mousedown', {clientX: 15, clientY: 15}));
    expect(component.couleurPosition).toHaveBeenCalledWith(15, 15);
  });

  // Test sourisDeplacee

  it('#sourisDeplacee devrait changer la hauteur choisie', () => {
    component.sourisEnfoncee(new MouseEvent('mousedown', {clientY : 15}));
    expect(component.hauteurChoisi).toEqual(15);
  });

  it('#sourisDeplacee devrait valider le dessin', () => {
    spyOn(component, 'draw');
    component.ngAfterViewInit();
    expect(component.draw).toHaveBeenCalled();
  });

  it('#sourisDeplacee devrait appeler couleurPosition sur les coordonnées donner', () => {
    spyOn(component, 'couleurPosition');
    component.sourisEnfoncee(new MouseEvent('mousedown', {clientX: 15, clientY: 15}));
    expect(component.couleurPosition).toHaveBeenCalledWith(15, 15);
  });

});
