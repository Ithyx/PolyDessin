import { TestBed } from '@angular/core/testing';

import { DrawElement } from '../stockage-svg/draw-element';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { TraceBrushService } from '../stockage-svg/trace-brush.service';
import { DessinPinceauService } from './dessin-pinceau.service';
import { OUTIL_VIDE } from './gestionnaire-outils.service';

describe('DessinPinceauService', () => {
  let service: DessinPinceauService;
  let stockageService: SVGStockageService;
  let element: DrawElement;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(DessinPinceauService));
  beforeEach(() => stockageService = TestBed.get(SVGStockageService));

  // Mettre l'outil pinceau comme l'outil actif
  beforeEach(() => {
    service.commandes.dessinEnCours = true;
    service.peutCliquer = true;
    service.outils.outilActif = service.outils.listeOutils[1];
    service.outils.outilActif.parametres[0].valeur = 5;

    element = new TraceBrushService();
    stockageService.setOngoingSVG(element);
    service.trait.SVG = 'L';
  });

  it('should be created', () => {
    const testService: DessinPinceauService = TestBed.get(DessinPinceauService);
    expect(testService).toBeTruthy();
  });

    // TESTS sourisCliquee

  it('#sourisCliquee devrait mettre peutCliquer vrai si peutCliquer est faux initialement', () => {
      service.peutCliquer = false;
      service.sourisCliquee(new MouseEvent('onclick'));
      expect(service.peutCliquer).toBe(true);
  });

  it('#sourisCliquee  devrait mettre dessinEnCours faux si peutCliquer est vrai', () => {
      service.sourisCliquee(new MouseEvent('onclick'));
      expect(service.commandes.dessinEnCours).toBe(false);
  });

  it("#sourisCliquee devrait mettre dessinEnCours faux si peutCliquer est vrai et que l'outil crayon n'a pas d'épaisseur", () => {
      service.outils.outilActif.parametres[0].valeur = 0;
      service.sourisCliquee(new MouseEvent('onclick'));
      expect(service.commandes.dessinEnCours).toBe(false);
  });

  it("#sourisCliquee devrait seulement être appelé si l'outil crayon a une épaisseur", () => {
      service.outils.outilActif.parametres[0].valeur = 0;
      service.trait.isAPoint = false;
      service.sourisCliquee(new MouseEvent('onclick'));
      expect(service.trait.isAPoint).toBe(false);
  });

  it('#sourisCliquee devrait appeler actualiserSVG après un clic avec crayon', () => {
      const clic = new MouseEvent('click', { clientX: 100, clientY: 100 });
      spyOn(service, 'actualiserSVG');
      service.sourisCliquee(clic);
      expect(service.actualiserSVG).toHaveBeenCalled();
  });

  it('#sourisCliquee devrait appeler executer de commande après un clic avec crayon', () => {
      const clic = new MouseEvent('click', { clientX: 100, clientY: 100 });
      spyOn(service.commandes, 'executer');
      service.sourisCliquee(clic);
      expect(service.commandes.executer).toHaveBeenCalled();
  });

  it('#sourisCliquee devrait mettre dessinEnCours faux si peutCliquer est vrai', () => {
      service.sourisCliquee(new MouseEvent('onclick'));
      expect(service.commandes.dessinEnCours).toBe(false);
  });

  it('#sourisCliquee devrait mettre réinitialiser trait à ses paramètres par défaut si peutCliquer est vrai', () => {
      service.sourisCliquee(new MouseEvent('onclick'));
      expect(service.trait).toEqual(new TraceBrushService());
  });

  // TESTS sourisDeplacee

  it('#sourisDeplacee ne devrait rien effectuer si dessinEnCours est faux', () => {
    service.commandes.dessinEnCours = false;
    spyOn(service, 'actualiserSVG');
    service.sourisDeplacee(new MouseEvent('release'));
    expect(service.actualiserSVG).not.toHaveBeenCalled();
  });

  it('#sourisDeplacee devrait ajouter la position de la souris au tableau de points', () => {
    service.trait.points = [];
    service.commandes.dessinEnCours = true;
    service.sourisDeplacee(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
    expect(service.trait.points[0]).toEqual({x: 100, y: 100});
  });

  it('#sourisDeplacee devrait appeler actualiserSVG si dessinEnCours est vrai', () => {
    spyOn(service, 'actualiserSVG');
    service.sourisDeplacee(new MouseEvent('release'));
    expect(service.actualiserSVG).toHaveBeenCalled();
  });

   // TESTS sourisEnfoncee

  it('#sourisEnfoncee devrait mettre dessinEnCours vrai', () => {
    service.commandes.dessinEnCours = false;
    service.sourisEnfoncee();
    expect(service.commandes.dessinEnCours).toBe(true);
  });

  it('#sourisEnfoncee devrait appeler actualiserSVG', () => {
    spyOn(service, 'actualiserSVG');
    service.sourisEnfoncee();
    expect(service.actualiserSVG).toHaveBeenCalled();
  });

 // TESTS sourisRelachee

  it('#sourisRelachee devrait rien effectuer si dessinEnCours est faux', () => {
    service.commandes.dessinEnCours = false;
    service.peutCliquer = false;
    service.sourisRelachee();
    expect(service.peutCliquer).toBe(false);
  });

  it("#sourisRelachee devrait changer peutCliquer à vrai si SVG de trait ne contient pas 'L'", () => {
    service.trait.SVG = 'P';
    service.sourisRelachee();
    expect(service.peutCliquer).toBe(true);
  });

  it("#sourisRelachee  devrait appeler executer de commandes si le SVG contient 'L'", () => {
    spyOn(service.commandes, 'executer');
    service.sourisRelachee();
    expect(service.commandes.executer).toHaveBeenCalled();
  });

  it('#sourisRelachee devrait réinitialiser trait à ses paramètres par défaut si dessinEnCours est vrai', () => {
    service.sourisRelachee();
    expect(service.trait).toEqual(new TraceBrushService());
  });

  it('#sourisRelachee devrait mettre dessinEnCours faux si dessinEnCours est vrai au debut de la fonction', () => {
    service.sourisRelachee();
    expect(service.commandes.dessinEnCours).toBe(false);
  });

  it('#sourisRelachee devrait mettre peutCliquer vrai si dessinEnCours est vrai au debut de la fonction', () => {
    service.sourisRelachee();
    expect(service.peutCliquer).toBe(true);
  });

  // TESTS sourisSortie

  it('#sourisSortie ne devrait pas appeler executer si dessinEnCours est faux', () => {
    service.commandes.dessinEnCours = false;
    spyOn(service.commandes, 'executer');
    service.sourisSortie();
    expect(service.commandes.executer).not.toHaveBeenCalled();
  });

  it('#sourisSortie devrait appeler executer si dessinEnCours est vrai', () => {
    spyOn(service.commandes, 'executer');
    service.sourisSortie();
    expect(service.commandes.executer).toHaveBeenCalled();
  });

  it('#sourisSortie devrait reinitialiser le trait en cours si dessinEnCours est vrai', () => {
    service.sourisSortie();
    expect(service.trait).toEqual(new TraceBrushService());
  });

  it('#sourisSortie devrait mettre dessinEnCours faux si dessinEnCours est vrai', () => {
    service.sourisSortie();
    expect(service.commandes.dessinEnCours).toBe(false);
  });

  it('#sourisSortie devrait mettre peutCliquer faux si dessinEnCours est faux', () => {
    service.commandes.dessinEnCours = false;
    service.sourisSortie();
    expect(service.peutCliquer).toBe(false);
  });

  // TESTS actualiserSVG

  it('#actualiserSVG devrait changer la couleur du trait', () => {
    service.trait.primaryColor = 'test';
    service.actualiserSVG();
    expect(service.trait.primaryColor).toEqual(service.couleur.getCouleurPrincipale());
  });

  it('#actualiserSVG devrait changer l\'outil du trait', () => {
    service.trait.tool = OUTIL_VIDE;
    service.actualiserSVG();
    expect(service.trait.tool).toEqual(service.outils.outilActif);
  });

  it('#actualiserSVG devrait appeler dessiner du trait', () => {
    spyOn(service.trait, 'draw');
    service.actualiserSVG();
    expect(service.trait.draw).toHaveBeenCalled();
  });

  it('#actualiserSVG devrait appeler setSVGEnCours avec le trait', () => {
    spyOn(stockageService, 'setOngoingSVG');
    service.actualiserSVG();
    expect(stockageService.setOngoingSVG).toHaveBeenCalledWith(service.trait);
  });
});
