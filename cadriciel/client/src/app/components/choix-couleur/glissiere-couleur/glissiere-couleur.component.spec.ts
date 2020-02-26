import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionnaireCommandesService } from 'src/app/services/commande/gestionnaire-commandes.service';
import { GestionnaireCouleursService } from 'src/app/services/couleur/color-manager.service';
import { ParametresCouleurService } from 'src/app/services/couleur/color-parameter.service';
import { GlissiereCouleurComponent } from './glissiere-couleur.component';

describe('GlissiereCouleurComponent', () => {
  let component: GlissiereCouleurComponent;
  let fixture: ComponentFixture<GlissiereCouleurComponent>;
  let commandes: GestionnaireCommandesService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlissiereCouleurComponent, ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlissiereCouleurComponent);
    component = fixture.componentInstance;
    commandes = TestBed.get(GestionnaireCommandesService);
    fixture.detectChanges();
    component.gestionnaireCouleur = new GestionnaireCouleursService(new ParametresCouleurService(), commandes)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test ngAfterViewInit
  it('#ngAferViewInit devrait valider le dessin', () => {
      spyOn(component, 'dessin');
      component.ngAfterViewInit();
      expect(component.dessin).toHaveBeenCalled();
  });

  // Test couleurEmise
  it('#couleurEmise devrait emettre la bonne couleur', () => {
    spyOn(component, 'couleurPosition');
    component.couleurEmise(25, 25);
    expect(component.couleurPosition).toHaveBeenCalledWith(25, 25);
  });

  // Test sourisRelache

  it('#sourisRelache devrait mettre a jour la variable sourisbas a faux', () => {
    component.onMouseRelease(new MouseEvent('mousedown'));
    spyOn(component, 'dessin');
    component.onMouseMove(new MouseEvent('mousemove'));
    expect(component.dessin).not.toHaveBeenCalled();
  });

  // Test sourisEnfoncee

  it('#sourisEnfoncee devrait mettre a jour la variable souris bas a vrai', () => {

    component.onMousePress(new MouseEvent ('mousedown'));
    spyOn(component, 'dessin');
    component.onMouseMove(new MouseEvent ('mousemove'));
    expect(component.dessin).toHaveBeenCalled();
  });

  it('#sourisEnfoncee devrait changer la hauteur choisie', () => {
    component.onMousePress(new MouseEvent('mousedown', {clientY: 35}));
    expect(component.hauteurChoisi).toBe(35);
  });

  it('#sourisEnfoncee devrait valider le dessin', () => {
    spyOn(component, 'dessin');
    component.ngAfterViewInit();
    expect(component.dessin).toHaveBeenCalled();
  });

  it('#sourisEnfoncee devrait appeler couleurPosition sur les coordonnées donner', () => {
    spyOn(component, 'couleurPosition');
    component.onMousePress(new MouseEvent('mousedown', {clientX: 15, clientY: 15}));
    expect(component.couleurPosition).toHaveBeenCalledWith(15, 15);
  });

  // Test sourisDeplacee

  it('#sourisDeplacee devrait changer la hauteur choisie', () => {
    component.onMousePress(new MouseEvent('mousedown', {clientY: 35}));
    expect(component.hauteurChoisi).toBe(35);
  });

  it('#sourisDeplacee devrait valider le dessin', () => {
    spyOn(component, 'dessin');
    component.ngAfterViewInit();
    expect(component.dessin).toHaveBeenCalled();
  });

  it('#sourisDeplacee devrait appeler couleurPosition sur les coordonnées donner', () => {
    spyOn(component, 'couleurPosition');
    component.onMousePress(new MouseEvent('mousedown', {clientX: 15, clientY: 15}));
    expect(component.couleurPosition).toHaveBeenCalledWith(15, 15);
  });

  // Test CouleurPosition

  it('#couleurPosition devrait actualiser la couleur du service gestionnaireCouleur', () => {
    component.gestionnaireCouleur.teinte = 'rgba(50, 50, 50,';
    component.dessin();
    component.couleurPosition(0, 0);
    expect(component.gestionnaireCouleur.couleur).toBe('rgba(255,3,0,');
  });

  it('#couleurPosition devrait actualiser le RGB du service gestionnaireCouleur', () => {
    component.gestionnaireCouleur.teinte = 'rgba(50, 50, 50,';
    component.dessin();
    component.couleurPosition(0, 0);
    expect(component.gestionnaireCouleur.RGB).toEqual([255, 3, 0]);
  });

});
