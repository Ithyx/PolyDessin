import { TestBed } from '@angular/core/testing';

import { RectangleService } from '../stockage-svg/rectangle.service';
import { RectangleToolService } from './rectangle-tool.service';

describe('DessinRectangleService', () => {
  let service: RectangleToolService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(RectangleToolService));
  beforeEach(() => {
    service.initial.x = 0;
    service.initial.y = 0;
    service.commands.drawingInProgress = true;
  });
  // Mettre l'outil de rectangle comme l'outil actif
  beforeEach(() => {
    service.tools.activeTool = service.tools.toolList[2];
    service.tools.activeTool.parameters[1].chosenOption = 'Contour';
    service.tools.activeTool.parameters[0].value = 5;
  });

  it('should be created', () => {
    const testService: RectangleToolService = TestBed.get(RectangleToolService);
    expect(testService).toBeTruthy();
  });

  // TESTS onMouseMove

  it('#onMouseMove ne devrait rien faire si commandes.drawingInProgress est faux', () => {
    service.commands.drawingInProgress = false;
    spyOn(service, 'shiftPress');
    spyOn(service, 'shiftRelease');
    // on simule un déplacement de souris quelconque
    service.onMouseMove(new MouseEvent('mousemove'));
    expect(service.shiftPress).not.toHaveBeenCalled();
    expect(service.shiftRelease).not.toHaveBeenCalled();
  });
  it('#onMouseMove devrait calculer la width et la height', () => {
    // on simule un mouvement de 50 en x et en y
    const evenement = new MouseEvent('mousemove', { clientX: 50, clientY: 50 });
    service.onMouseMove(evenement);
    // on vérifie que la width et la height ont les bonnes valeurs
    expect(service.calculatedHeight).toBe(50);
    expect(service.calculatedHeight).toBe(50);
  });
  it('#onMouseMove devrait calculer correctement la width et la height '
    + 'pour un déplacement avec des valeurs négatives', () => {
    // on simule un mouvement de -50 en x et en y
    const evenement = new MouseEvent('mousemove', { clientX: -50, clientY: -50 });
    service.onMouseMove(evenement);
    // on vérifie que la width et la height ont les bonnes valeurs
    expect(service.calculatedHeight).toBe(50);
    expect(service.calculatedHeight).toBe(50);
  });
  it('#onMouseMove devrait calculer la base en X et en Y', () => {
    // on simule un mouvement de 50 en x et en y
    const evenement = new MouseEvent('mousemove', { clientX: 50, clientY: 50 });
    service.onMouseMove(evenement);
    // on vérifie que les coordonnées de la base ont les bonnes valeurs
    expect(service.calculatedBase.x).toBe(0);
    expect(service.calculatedBase.y).toBe(0);
  });
  it('#onMouseMove devrait calculer correctement la base en X et en Y '
    + 'pour un déplacement avec des valeurs négatives', () => {
    // on simule un mouvement de -50 en x et en y
    const evenement = new MouseEvent('mousemove', { clientX: -50, clientY: -50 });
    service.onMouseMove(evenement);
    // on vérifie que les coordonnées de la base ont ont les bonnes valeurs
    expect(service.calculatedBase.x).toBe(-50);
    expect(service.calculatedBase.y).toBe(-50);
  });
  it('#onMouseMove devrait former un carré si shift est enfoncé', () => {
    // on simule un déplacement de souris avec shift enfoncé
    spyOn(service, 'shiftPress');
    service.onMouseMove(new MouseEvent('mousemove', { shiftKey: true }));
    // on vérifie que la fonction pour former un carré a été appelée
    expect(service.shiftPress).toHaveBeenCalled();
  });
  it("#onMouseMove devrait former un rectangle (ou une ligne) si shift n'est pas enfoncé", () => {
    // on simule un déplacement de souris sans shift enfoncé
    spyOn(service, 'shiftRelease');
    service.onMouseMove(new MouseEvent('mousemove', { shiftKey: false }));
    // on vérifie que la fonction pour former un rectangle a été appelée
    expect(service.shiftRelease).toHaveBeenCalled();
  });

  // TESTS shiftRelease

  it('#shiftRelease ne devrait rien faire si commandes.drawingInProgress est faux', () => {
    service.commands.drawingInProgress = false;
    spyOn(service, 'refreshSVG');
    service.shiftRelease();
    expect(service.refreshSVG).not.toHaveBeenCalled();
  });
  it('#shiftRelease devrait actualiser la height du rectangle si commandes.drawingInProgress est vrai', () => {
    service.calculatedHeight = 1;
    service.shiftRelease();
    expect(service.rectangle.height).toEqual(1);
  });
  it('#shiftRelease devrait actualiser la width du rectangle si commandes.drawingInProgress est vrai', () => {
    service.calculatedHeight = 2;
    service.shiftRelease();
    expect(service.rectangle.width).toEqual(2);
  });
  // it('#shiftRelease devrait actualiser la base en x du rectangle si commandes.drawingInProgress est vrai', () => {
  //   service.calculatedBase.x = 3;
  //   service.shiftRelease();
  //   expect(service.rectangle.base.x).toEqual(3);
  // });
  // it('#shiftRelease devrait actualiser la base en y du rectangle si commandes.drawingInProgress est vrai', () => {
  //   service.calculatedBase.y = 4;
  //   service.shiftRelease();
  //   expect(service.rectangle.base.y).toEqual(4);
  // });
  it('#shiftRelease devrait actualise le SVG si commandes.drawingInProgress est vrai', () => {
    spyOn(service, 'refreshSVG');
    service.shiftRelease();
    expect(service.refreshSVG).toHaveBeenCalled();
  });

  // TESTS shiftPress

  it('#shiftPress ne devrait rien faire si commandes.drawingInProgress est faux', () => {
    service.commands.drawingInProgress = false;
    spyOn(service, 'refreshSVG');
    service.shiftPress();
    expect(service.refreshSVG).not.toHaveBeenCalled();
  });
  it('#shiftPress devrait actualise le SVG si commandes.drawingInProgress est faux', () => {
    spyOn(service, 'refreshSVG');
    service.shiftPress();
    expect(service.refreshSVG).toHaveBeenCalled();
  });
  it('#shiftPress devrait corriger la width si elle est plus grande '
    + 'que la height', () => {
    service.calculatedHeight = 100;
    service.calculatedHeight = 50;
    service.shiftPress();
    expect(service.rectangle.width).toBe(50);
  });
  it('#shiftPress ne devrait pas corriger la width si elle est plus petite '
    + 'que la height', () => {
    service.calculatedHeight = 50;
    service.calculatedHeight = 100;
    service.shiftPress();
    expect(service.rectangle.width).toBe(50);
  });
  it('#shiftPress devrait corriger la height si elle est plus grande '
    + 'que la width', () => {
    service.calculatedHeight = 50;
    service.calculatedHeight = 100;
    service.shiftPress();
    expect(service.rectangle.height).toBe(50);
  });
  it('#shiftPress ne devrait pas corriger la height si elle est plus petite '
    + 'que la width', () => {
    service.calculatedHeight = 100;
    service.calculatedHeight = 50;
    service.shiftPress();
    expect(service.rectangle.width).toBe(50);
  });
  // it('#shiftPress devrait corriger la base en Y si elle diffère '
  //   + 'du Y initial et que la width est supérieure à la height', () => {
  //   service.calculatedBase.y = 50;
  //   service.calculatedHeight = 5;
  //   service.calculatedHeight = 10;
  //   service.shiftPress();
  //   expect(service.rectangle.base.y).toBe(55);
  // });
  // it('#shiftPress ne devrait pas corriger la base en Y si elle est égale '
  //   + 'au Y initial et que la width est supérieure à la height', () => {
  //   service.calculatedBase.y = 0;
  //   service.calculatedHeight = 5;
  //   service.calculatedHeight = 10;
  //   service.shiftPress();
  //   expect(service.rectangle.base.y).toBe(0);
  // });
  // it('#shiftPress devrait corriger la base en X si elle diffère '
  //   + 'du X initial et que la height est supérieure à la width', () => {
  //   service.calculatedBase.x = 50;
  //   service.calculatedHeight = 10;
  //   service.calculatedHeight = 5;
  //   service.shiftPress();
  //   expect(service.rectangle.base.x).toBe(55);
  // });
  // it('#shiftPress ne devrait pas corriger la base en X si elle est égale '
  //   + 'au X initial et que la height est supérieure à la width', () => {
  //   service.calculatedBase.x = 0;
  //   service.calculatedHeight = 10;
  //   service.calculatedHeight = 5;
  //   service.shiftPress();
  //   expect(service.rectangle.base.x).toBe(0);
  // });

  // TODO : Déplacer les tests de création de SVG vers RectangleService

  // TESTS SUR LA CRÉATION DE RECTANGLES
  /*
  it("#refreshSVG devrait tracer un rectangle lors d'un mouvement "
    + 'vers le coin inférieur droit', () => {
    // on simule un mouvement de 20 en x et de 50 en y
    const evenement = new MouseEvent('mousemove', { clientX: 20, clientY: 50 });
    service.onMouseMove(evenement);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours() + '"/>').toEqual(referenceSVG);
  });
  it("#refreshSVG devrait tracer un rectangle lors d'un mouvement "
    + 'vers le coin supérieur droit', () => {
    // on simule un mouvement de 20 en x et de -50 en y
    service.initial.y = 50;
    const evenement = new MouseEvent('mousemove', { clientX: 20, clientY: 0 });
    service.onMouseMove(evenement);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours() + '"/>').toEqual(referenceSVG);
  });
  it("#refreshSVG devrait tracer un rectangle lors d'un mouvement "
    + 'vers le coin inférieur gauche', () => {
    // on simule un mouvement de -20 en x et de 50 en y
    service.initial.x = 20;
    const evenement = new MouseEvent('mousemove', { clientX: 0, clientY: 50 });
    service.onMouseMove(evenement);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours() + '"/>').toEqual(referenceSVG);
  });
  it("#refreshSVG devrait tracer un rectangle lors d'un mouvement "
    + 'vers le coin supérieur gauche', () => {
    // on simule un mouvement de -20 en x et de -50 en y
    service.initial.x = 20;
    service.initial.y = 50;
    const evenement = new MouseEvent('mousemove', { clientX: 0, clientY: 0 });
    service.onMouseMove(evenement);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours() + '"/>').toEqual(referenceSVG);
  });
  it("#refreshSVG devrait tracer un rectangle sans contour si l'épaisseur"
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
    service.refreshSVG();
    expect(stockageService.getSVGEnCours()).toContain('stroke-width="0"');
  });

  // TESTS SUR LA CRÉATION DE LIGNES

  it('#refreshSVG devrait tracer une ligne si la height est nulle', () => {
    // on simule un mouvement de 20 en x et de 0 en y
    const evenement = new MouseEvent('mousemove', { clientX: 20, clientY: 0 });
    service.onMouseMove(evenement);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours()).toContain('<line');
  });
  it('#refreshSVG devrait tracer une ligne si la width est nulle', () => {
    // on simule un mouvement de 0 en x et de 20 en y
    const evenement = new MouseEvent('mousemove', { clientX: 0, clientY: 20 });
    service.onMouseMove(evenement);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours()).toContain('<line');
  });
  it('#refreshSVG ne devrait pas tracer de ligne si le tracé est plein sans contour', () => {
    // on simule un mouvement de 0 en x et de 20 en y
    service.outils.outilActif.parametres[1].optionChoisie = 'Plein';
    const evenement = new MouseEvent('mousemove', { clientX: 0, clientY: 20 });
    service.onMouseMove(evenement);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours()).toContain('<rect');
  });

  // TESTS SUR LA CRÉATION DE PÉRIMÈTRES

  it("#refreshSVG devrait tracer un périmètre en prenant en compte l'épaisseur "
    + "s'il y a un contour", () => {
    // on simule un mouvement de 20 en x et de 50 en y
    const evenement = new MouseEvent('mousemove', { clientX: 20, clientY: 50 });
    service.onMouseMove(evenement);
    // on vérifie le périmètre qui a été tracé
    expect(String(stockageService.getPerimetreEnCoursHTML())).toContain(
      'x="-2.5" y="-2.5" height="55" width="25"'
    );
  });
  it("#refreshSVG devrait tracer un périmètre sans prendre en compte l'épaisseur "
    + "s'il n'y a pas de contour", () => {
    // on simule un mouvement de 20 en x et de 50 en y
    service.outils.outilActif.parametres[1].optionChoisie = 'Plein';
    const evenement = new MouseEvent('mousemove', { clientX: 20, clientY: 50 });
    service.onMouseMove(evenement);
    // on vérifie le périmètre qui a été tracé
    expect(String(stockageService.getPerimetreEnCoursHTML())).toContain(
      'x="0" y="0" height="50" width="20"'
    );
  });
  it("#refreshSVG devrait tracer un périmètre autour d'une ligne "
    + 'dans le cas où une ligne est tracée', () => {
    // on simule un mouvement de 0 en x et de 20 en y
    const evenement = new MouseEvent('mousemove', { clientX: 0, clientY: 20 });
    service.onMouseMove(evenement);
    // on vérifie le périmètre qui a été tracé
    expect(String(stockageService.getPerimetreEnCoursHTML())).toContain(
      'x="-2.5" y="-2.5" height="25" width="5"'
    );
  });*/

  // TESTS onMousePress

  it("#onMousePress devrait avoir commandes.drawingInProgress vrai apres un clic s'il est deja vrai", () => {
      // on effectue un clic dans cette fonction
      service.onMousePress(new MouseEvent('onclick'));
      // on vérifie que la fonction ne fait rien puisque rectangle est deja vrai
      expect(service.commands.drawingInProgress).toBe(true);
  });
  it('#onMousePress devrait mettre commandes.drawingInProgress vrai apres un clic', () => {
    service.commands.drawingInProgress = false;
    // on effectue un clic dans cette fonction
    service.onMousePress(new MouseEvent('onclick'));
    // on vérifie que la fonction met commandes.drawingInProgress vrai
    expect(service.commands.drawingInProgress).toBe(true);
  });
  it('#onMousePress devrait contenir les coordonnees initiales du clic', () => {
    service.commands.drawingInProgress = false;
    service.initial.x = 200; service.initial.y = 200;
    // on fait un clic aux coordonnees (100,50)
    const clic = new MouseEvent('click', { clientX: 100, clientY: 50 });
    service.onMousePress(clic);
    // on vérifie que la fonction contient les coordonnees correctement
    expect(service.initial.x).toBe(100);
    expect(service.initial.y).toBe(50);
  });
  it('#onMousePress devrait remettre la height et la width à 0', () => {
    service.commands.drawingInProgress = false;
    service.rectangle.height = 100; service.rectangle.width = 100;
    // on fait un clic aux coordonnees (100,50)
    const clic = new MouseEvent('click', { clientX: 100, clientY: 50 });
    service.onMousePress(clic);
    // on vérifie que la fonction contient la width et longueur à 0
    expect(service.rectangle.height).toBe(0);
    expect(service.rectangle.width).toBe(0);
  });

  // TESTS onMouseRelease

  it('#onMouseRelease devrait mettre commandes.drawingInProgress faux apres un clic', () => {
    // on effectue un clic dans cette fonction
    service.onMouseRelease();
    // on vérifie que la fonction met commandes.drawingInProgress faux
    expect(service.commands.drawingInProgress).toBe(false);
  });
  it("#onMouseRelease devrait s'assurer que le curseur n'est pas nul " +
      'en height et width apres un relachement de clic', () => {
    // la height et la width sont nulles
    service.rectangle.height = 0;
    service.rectangle.width = 0;
    spyOn(service.commands, 'execute');
    service.onMouseRelease();
    // vérifier que la fonction d'AjoutSVG n'a pas été appelée
    expect(service.commands.execute).not.toHaveBeenCalled();
  });
  // it('#onMouseRelease devrait appeler correctement la fonction execute avec un AjoutSVG', () => {
  //   // la height et la width sont non nulles
  //   const rectangle = new RectangleService();
  //   rectangle.height = 10;
  //   rectangle.width = 10;
  //   rectangle.base = {x: 42, y: 42};
  //   service.rectangle = rectangle;
  //   spyOn(service.commands, 'execute');
  //   service.onMouseRelease();
  //   // vérifier que la fonction ajouterSVG a été correctement appelée
  //   const ajout = new AddSVGService(rectangle, stockageService);
  //   ajout.SVGKey = 1;
  //   expect(service.commands.execute).toHaveBeenCalledWith(ajout);
  // });
  it('#onMouseRelease devrait reinitialiser le rectangle', () => {
    const rectangle = new RectangleService();
    rectangle.height = 10;
    rectangle.width = 10;
    // rectangle.base = {x: 42, y: 42};
    service.rectangle = rectangle;
    service.onMouseRelease();
    // vérifier que le SVG est vide
    expect(service.rectangle).toEqual(new RectangleService());
  });
  it('#onMouseRelease devrait reinitialiser la base calculee', () => {
    service.calculatedBase = {x: 100, y: 100};
    service.onMouseRelease();
    expect(service.calculatedBase).toEqual({x: 0, y: 0});
  });
  it('#onMouseRelease devrait reinitialiser la height calculee', () => {
    service.calculatedHeight = 100;
    service.onMouseRelease();
    expect(service.calculatedHeight).toEqual(0);
  });
  it('#onMouseRelease devrait reinitialiser la width calculee', () => {
    service.calculatedHeight = 100;
    service.onMouseRelease();
    expect(service.calculatedHeight).toEqual(0);
  });

  // TESTS clear

  it('#clear devrait mettre commandes.drawingInProgress faux', () => {
    service.clear();
    expect(service.commands.drawingInProgress).toBe(false);
  });

  // it('#clear devrait reinitialiser le rectangle', () => {
  //   const rectangle = new RectangleService();
  //   rectangle.height = 10;
  //   rectangle.width = 10;
  //   rectangle.base = {x: 42, y: 42};
  //   service.rectangle = rectangle;
  //   service.clear();
  //   // vérifier que le SVG est vide
  //   expect(service.rectangle).toEqual(new RectangleService());
  // });
});
