import { TestBed } from '@angular/core/testing';

import { AjoutSvgService } from '../commande/add-svg.service';
import { RectangleService } from '../stockage-svg/rectangle.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { RectangleToolService } from './rectangle-tool.service';

describe('DessinRectangleService', () => {
  let service: RectangleToolService;
  let stockageService: SVGStockageService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(RectangleToolService));
  beforeEach(() => stockageService = TestBed.get(SVGStockageService));
  beforeEach(() => {
    service.initial.x = 0;
    service.initial.y = 0;
    service.commandes.dessinEnCours = true;
  });
  // Mettre l'outil de rectangle comme l'outil actif
  beforeEach(() => {
    service.tools.activeTool = service.tools.toolList[2];
    service.tools.activeTool.parameters[1].choosenOption = 'Contour';
    service.tools.activeTool.parameters[0].value = 5;
  });

  it('should be created', () => {
    const testService: RectangleToolService = TestBed.get(RectangleToolService);
    expect(testService).toBeTruthy();
  });

  // TESTS DE SOURIS DEPLACEE

  it('#sourisDeplacee ne devrait rien faire si commandes.dessinEnCours est faux', () => {
    service.commandes.dessinEnCours = false;
    spyOn(service, 'shiftEnfonce');
    spyOn(service, 'shiftRelache');
    // on simule un déplacement de souris quelconque
    service.onMouseMove(new MouseEvent('mousemove'));
    expect(service.shiftPress).not.toHaveBeenCalled();
    expect(service.shiftRelease).not.toHaveBeenCalled();
  });
  it('#sourisDeplacee devrait calculer la largeur et la hauteur', () => {
    // on simule un mouvement de 50 en x et en y
    const evenement = new MouseEvent('mousemove', { clientX: 50, clientY: 50 });
    service.onMouseMove(evenement);
    // on vérifie que la largeur et la hauteur ont les bonnes valeurs
    expect(service.calculatedHeight).toBe(50);
    expect(service.calculatedHeight).toBe(50);
  });
  it('#sourisDeplacee devrait calculer correctement la largeur et la hauteur '
    + 'pour un déplacement avec des valeurs négatives', () => {
    // on simule un mouvement de -50 en x et en y
    const evenement = new MouseEvent('mousemove', { clientX: -50, clientY: -50 });
    service.onMouseMove(evenement);
    // on vérifie que la largeur et la hauteur ont les bonnes valeurs
    expect(service.calculatedHeight).toBe(50);
    expect(service.calculatedHeight).toBe(50);
  });
  it('#sourisDeplacee devrait calculer la base en X et en Y', () => {
    // on simule un mouvement de 50 en x et en y
    const evenement = new MouseEvent('mousemove', { clientX: 50, clientY: 50 });
    service.onMouseMove(evenement);
    // on vérifie que les coordonnées de la base ont les bonnes valeurs
    expect(service.calculatedBase.x).toBe(0);
    expect(service.calculatedBase.y).toBe(0);
  });
  it('#sourisDeplacee devrait calculer correctement la base en X et en Y '
    + 'pour un déplacement avec des valeurs négatives', () => {
    // on simule un mouvement de -50 en x et en y
    const evenement = new MouseEvent('mousemove', { clientX: -50, clientY: -50 });
    service.onMouseMove(evenement);
    // on vérifie que les coordonnées de la base ont ont les bonnes valeurs
    expect(service.calculatedBase.x).toBe(-50);
    expect(service.calculatedBase.y).toBe(-50);
  });
  it('#sourisDeplacee devrait former un carré si shift est enfoncé', () => {
    // on simule un déplacement de souris avec shift enfoncé
    spyOn(service, 'shiftEnfonce');
    service.onMouseMove(new MouseEvent('mousemove', { shiftKey: true }));
    // on vérifie que la fonction pour former un carré a été appelée
    expect(service.shiftPress).toHaveBeenCalled();
  });
  it("#sourisDeplacee devrait former un rectangle (ou une ligne) si shift n'est pas enfoncé", () => {
    // on simule un déplacement de souris sans shift enfoncé
    spyOn(service, 'shiftRelache');
    service.onMouseMove(new MouseEvent('mousemove', { shiftKey: false }));
    // on vérifie que la fonction pour former un rectangle a été appelée
    expect(service.shiftRelease).toHaveBeenCalled();
  });

  // TESTS DE SHIFT RELACHE

  it('#shiftRelache ne devrait rien faire si commandes.dessinEnCours est faux', () => {
    service.commandes.dessinEnCours = false;
    spyOn(service, 'actualiserSVG');
    service.shiftRelease();
    expect(service.refreshSVG).not.toHaveBeenCalled();
  });
  it('#shiftRelache devrait actualiser la hauteur du rectangle si commandes.dessinEnCours est vrai', () => {
    service.calculatedHeight = 1;
    service.shiftRelease();
    expect(service.rectangle.hauteur).toEqual(1);
  });
  it('#shiftRelache devrait actualiser la largeur du rectangle si commandes.dessinEnCours est vrai', () => {
    service.calculatedHeight = 2;
    service.shiftRelease();
    expect(service.rectangle.largeur).toEqual(2);
  });
  it('#shiftRelache devrait actualiser la base en x du rectangle si commandes.dessinEnCours est vrai', () => {
    service.calculatedBase.x = 3;
    service.shiftRelease();
    expect(service.rectangle.base.x).toEqual(3);
  });
  it('#shiftRelache devrait actualiser la base en y du rectangle si commandes.dessinEnCours est vrai', () => {
    service.calculatedBase.y = 4;
    service.shiftRelease();
    expect(service.rectangle.base.y).toEqual(4);
  });
  it('#shiftRelache devrait actualise le SVG si commandes.dessinEnCours est vrai', () => {
    spyOn(service, 'actualiserSVG');
    service.shiftRelease();
    expect(service.refreshSVG).toHaveBeenCalled();
  });

  // TESTS DE SHIFT ENFONCE

  it('#shiftEnfonce ne devrait rien faire si commandes.dessinEnCours est faux', () => {
    service.commandes.dessinEnCours = false;
    spyOn(service, 'actualiserSVG');
    service.shiftPress();
    expect(service.refreshSVG).not.toHaveBeenCalled();
  });
  it('#shiftEnfonce devrait actualise le SVG si commandes.dessinEnCours est faux', () => {
    spyOn(service, 'actualiserSVG');
    service.shiftPress();
    expect(service.refreshSVG).toHaveBeenCalled();
  });
  it('#shiftEnfonce devrait corriger la largeur si elle est plus grande '
    + 'que la hauteur', () => {
    service.calculatedHeight = 100;
    service.calculatedHeight = 50;
    service.shiftPress();
    expect(service.rectangle.largeur).toBe(50);
  });
  it('#shiftEnfonce ne devrait pas corriger la largeur si elle est plus petite '
    + 'que la hauteur', () => {
    service.calculatedHeight = 50;
    service.calculatedHeight = 100;
    service.shiftPress();
    expect(service.rectangle.largeur).toBe(50);
  });
  it('#shiftEnfonce devrait corriger la hauteur si elle est plus grande '
    + 'que la largeur', () => {
    service.calculatedHeight = 50;
    service.calculatedHeight = 100;
    service.shiftPress();
    expect(service.rectangle.hauteur).toBe(50);
  });
  it('#shiftEnfonce ne devrait pas corriger la hauteur si elle est plus petite '
    + 'que la largeur', () => {
    service.calculatedHeight = 100;
    service.calculatedHeight = 50;
    service.shiftPress();
    expect(service.rectangle.largeur).toBe(50);
  });
  it('#shiftEnfonce devrait corriger la base en Y si elle diffère '
    + 'du Y initial et que la largeur est supérieure à la hauteur', () => {
    service.calculatedBase.y = 50;
    service.calculatedHeight = 5;
    service.calculatedHeight = 10;
    service.shiftPress();
    expect(service.rectangle.base.y).toBe(55);
  });
  it('#shiftEnfonce ne devrait pas corriger la base en Y si elle est égale '
    + 'au Y initial et que la largeur est supérieure à la hauteur', () => {
    service.calculatedBase.y = 0;
    service.calculatedHeight = 5;
    service.calculatedHeight = 10;
    service.shiftPress();
    expect(service.rectangle.base.y).toBe(0);
  });
  it('#shiftEnfonce devrait corriger la base en X si elle diffère '
    + 'du X initial et que la hauteur est supérieure à la largeur', () => {
    service.calculatedBase.x = 50;
    service.calculatedHeight = 10;
    service.calculatedHeight = 5;
    service.shiftPress();
    expect(service.rectangle.base.x).toBe(55);
  });
  it('#shiftEnfonce ne devrait pas corriger la base en X si elle est égale '
    + 'au X initial et que la hauteur est supérieure à la largeur', () => {
    service.calculatedBase.x = 0;
    service.calculatedHeight = 10;
    service.calculatedHeight = 5;
    service.shiftPress();
    expect(service.rectangle.base.x).toBe(0);
  });

  // TODO : Déplacer les tests de création de SVG vers RectangleService

  // TESTS SUR LA CRÉATION DE RECTANGLES
  /*
  it("#actualiserSVG devrait tracer un rectangle lors d'un mouvement "
    + 'vers le coin inférieur droit', () => {
    // on simule un mouvement de 20 en x et de 50 en y
    const evenement = new MouseEvent('mousemove', { clientX: 20, clientY: 50 });
    service.sourisDeplacee(evenement);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours() + '"/>').toEqual(referenceSVG);
  });
  it("#actualiserSVG devrait tracer un rectangle lors d'un mouvement "
    + 'vers le coin supérieur droit', () => {
    // on simule un mouvement de 20 en x et de -50 en y
    service.initial.y = 50;
    const evenement = new MouseEvent('mousemove', { clientX: 20, clientY: 0 });
    service.sourisDeplacee(evenement);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours() + '"/>').toEqual(referenceSVG);
  });
  it("#actualiserSVG devrait tracer un rectangle lors d'un mouvement "
    + 'vers le coin inférieur gauche', () => {
    // on simule un mouvement de -20 en x et de 50 en y
    service.initial.x = 20;
    const evenement = new MouseEvent('mousemove', { clientX: 0, clientY: 50 });
    service.sourisDeplacee(evenement);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours() + '"/>').toEqual(referenceSVG);
  });
  it("#actualiserSVG devrait tracer un rectangle lors d'un mouvement "
    + 'vers le coin supérieur gauche', () => {
    // on simule un mouvement de -20 en x et de -50 en y
    service.initial.x = 20;
    service.initial.y = 50;
    const evenement = new MouseEvent('mousemove', { clientX: 0, clientY: 0 });
    service.sourisDeplacee(evenement);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours() + '"/>').toEqual(referenceSVG);
  });
  it("#actualiserSVG devrait tracer un rectangle sans contour si l'épaisseur"
    + 'est invalide', () => {
    service.outils.outilActif = {
      nom: 'outilActifTest',
      estActif: true,
      ID: 0,
      parametres: [
        {type: 'select', nom: 'testEpaisseurInvalide', optionChoisie: '1', options: ['1', '2']},
        {type: 'select', nom: 'testTypeTrace', optionChoisie: '1', options: ['1', '2']}
      ],
      nomIcone: ''
    };
    service.actualiserSVG();
    expect(stockageService.getSVGEnCours()).toContain('stroke-width="0"');
  });

  // TESTS SUR LA CRÉATION DE LIGNES

  it('#actualiserSVG devrait tracer une ligne si la hauteur est nulle', () => {
    // on simule un mouvement de 20 en x et de 0 en y
    const evenement = new MouseEvent('mousemove', { clientX: 20, clientY: 0 });
    service.sourisDeplacee(evenement);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours()).toContain('<line');
  });
  it('#actualiserSVG devrait tracer une ligne si la largeur est nulle', () => {
    // on simule un mouvement de 0 en x et de 20 en y
    const evenement = new MouseEvent('mousemove', { clientX: 0, clientY: 20 });
    service.sourisDeplacee(evenement);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours()).toContain('<line');
  });
  it('#actualiserSVG ne devrait pas tracer de ligne si le tracé est plein sans contour', () => {
    // on simule un mouvement de 0 en x et de 20 en y
    service.outils.outilActif.parametres[1].optionChoisie = 'Plein';
    const evenement = new MouseEvent('mousemove', { clientX: 0, clientY: 20 });
    service.sourisDeplacee(evenement);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours()).toContain('<rect');
  });

  // TESTS SUR LA CRÉATION DE PÉRIMÈTRES

  it("#actualiserSVG devrait tracer un périmètre en prenant en compte l'épaisseur "
    + "s'il y a un contour", () => {
    // on simule un mouvement de 20 en x et de 50 en y
    const evenement = new MouseEvent('mousemove', { clientX: 20, clientY: 50 });
    service.sourisDeplacee(evenement);
    // on vérifie le périmètre qui a été tracé
    expect(String(stockageService.getPerimetreEnCoursHTML())).toContain(
      'x="-2.5" y="-2.5" height="55" width="25"'
    );
  });
  it("#actualiserSVG devrait tracer un périmètre sans prendre en compte l'épaisseur "
    + "s'il n'y a pas de contour", () => {
    // on simule un mouvement de 20 en x et de 50 en y
    service.outils.outilActif.parametres[1].optionChoisie = 'Plein';
    const evenement = new MouseEvent('mousemove', { clientX: 20, clientY: 50 });
    service.sourisDeplacee(evenement);
    // on vérifie le périmètre qui a été tracé
    expect(String(stockageService.getPerimetreEnCoursHTML())).toContain(
      'x="0" y="0" height="50" width="20"'
    );
  });
  it("#actualiserSVG devrait tracer un périmètre autour d'une ligne "
    + 'dans le cas où une ligne est tracée', () => {
    // on simule un mouvement de 0 en x et de 20 en y
    const evenement = new MouseEvent('mousemove', { clientX: 0, clientY: 20 });
    service.sourisDeplacee(evenement);
    // on vérifie le périmètre qui a été tracé
    expect(String(stockageService.getPerimetreEnCoursHTML())).toContain(
      'x="-2.5" y="-2.5" height="25" width="5"'
    );
  });*/

  // TESTS DE SOURIS ENFONCEE

  it("#sourisEnfoncee devrait avoir commandes.dessinEnCours vrai apres un clic s'il est deja vrai", () => {
      // on effectue un clic dans cette fonction
      service.onMousePress(new MouseEvent('onclick'));
      // on vérifie que la fonction ne fait rien puisque rectangle est deja vrai
      expect(service.commandes.dessinEnCours).toBe(true);
  });
  it('#sourisEnfoncee devrait mettre commandes.dessinEnCours vrai apres un clic', () => {
    service.commandes.dessinEnCours = false;
    // on effectue un clic dans cette fonction
    service.onMousePress(new MouseEvent('onclick'));
    // on vérifie que la fonction met commandes.dessinEnCours vrai
    expect(service.commandes.dessinEnCours).toBe(true);
  });
  it('#sourisEnfoncee devrait contenir les coordonnees initiales du clic', () => {
    service.commandes.dessinEnCours = false;
    service.initial.x = 200; service.initial.y = 200;
    // on fait un clic aux coordonnees (100,50)
    const clic = new MouseEvent('click', { clientX: 100, clientY: 50 });
    service.onMousePress(clic);
    // on vérifie que la fonction contient les coordonnees correctement
    expect(service.initial.x).toBe(100);
    expect(service.initial.y).toBe(50);
  });
  it('#sourisEnfoncee devrait remettre la hauteur et la largeur à 0', () => {
    service.commandes.dessinEnCours = false;
    service.rectangle.hauteur = 100; service.rectangle.largeur = 100;
    // on fait un clic aux coordonnees (100,50)
    const clic = new MouseEvent('click', { clientX: 100, clientY: 50 });
    service.onMousePress(clic);
    // on vérifie que la fonction contient la largeur et longueur à 0
    expect(service.rectangle.hauteur).toBe(0);
    expect(service.rectangle.largeur).toBe(0);
  });

  // TESTS DE SOURIS RELACHEE

  it('#sourisRelachee devrait mettre commandes.dessinEnCours faux apres un clic', () => {
    // on effectue un clic dans cette fonction
    service.onMouseRelease();
    // on vérifie que la fonction met commandes.dessinEnCours faux
    expect(service.commandes.dessinEnCours).toBe(false);
  });
  it("#sourisRelachee devrait s'assurer que le curseur n'est pas nul " +
      'en hauteur et largeur apres un relachement de clic', () => {
    // la hauteur et la largeur sont nulles
    service.rectangle.hauteur = 0;
    service.rectangle.largeur = 0;
    spyOn(service.commandes, 'executer');
    service.onMouseRelease();
    // vérifier que la fonction d'AjoutSVG n'a pas été appelée
    expect(service.commandes.executer).not.toHaveBeenCalled();
  });
  it('#sourisRelachee devrait appeler correctement la fonction executer avec un AjoutSVG', () => {
    // la hauteur et la largeur sont non nulles
    const rectangle = new RectangleService();
    rectangle.hauteur = 10;
    rectangle.largeur = 10;
    rectangle.base = {x: 42, y: 42};
    service.rectangle = rectangle;
    spyOn(service.commandes, 'executer');
    service.onMouseRelease();
    // vérifier que la fonction ajouterSVG a été correctement appelée
    const ajout = new AjoutSvgService(rectangle, stockageService);
    ajout.cleSVG = 1;
    expect(service.commandes.executer).toHaveBeenCalledWith(ajout);
  });
  it('#sourisRelachee devrait reinitialiser le rectangle', () => {
    const rectangle = new RectangleService();
    rectangle.hauteur = 10;
    rectangle.largeur = 10;
    rectangle.base = {x: 42, y: 42};
    service.rectangle = rectangle;
    service.onMouseRelease();
    // vérifier que le SVG est vide
    expect(service.rectangle).toEqual(new RectangleService());
  });
  it('#sourisRelachee devrait reinitialiser la base calculee', () => {
    service.calculatedBase = {x: 100, y: 100};
    service.onMouseRelease();
    expect(service.calculatedBase).toEqual({x: 0, y: 0});
  });
  it('#sourisRelachee devrait reinitialiser la hauteur calculee', () => {
    service.calculatedHeight = 100;
    service.onMouseRelease();
    expect(service.calculatedHeight).toEqual(0);
  });
  it('#sourisRelachee devrait reinitialiser la largeur calculee', () => {
    service.calculatedHeight = 100;
    service.onMouseRelease();
    expect(service.calculatedHeight).toEqual(0);
  });

  // TESTS vider

  it('#vider devrait mettre commandes.dessinEnCours faux', () => {
    service.clear();
    expect(service.commandes.dessinEnCours).toBe(false);
  });

  it('#vider devrait reinitialiser le rectangle', () => {
    const rectangle = new RectangleService();
    rectangle.hauteur = 10;
    rectangle.largeur = 10;
    rectangle.base = {x: 42, y: 42};
    service.rectangle = rectangle;
    service.clear();
    // vérifier que le SVG est vide
    expect(service.rectangle).toEqual(new RectangleService());
  });
});
