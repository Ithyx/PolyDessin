import { TestBed } from '@angular/core/testing';

import { DrawingToolService } from '../tools/pencil-tool.service';
import { RectangleService } from './rectangle.service';

// tslint:disable:no-magic-numbers
describe('RectangleService', () => {
  let service: DrawingToolService;
  let element: RectangleService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(DrawingToolService));

  beforeEach(() => {
    element = new RectangleService();
    element.updateParameters(service.tools.toolList[3]);
    element.points[0].x = 10;
    element.points[0].y = 100;
    element.points[1].x = 100;
    element.points[1].y = 10;
    element.chosenOption = 'Vide';
    element.primaryColor =   'rgba(0, 0, 0, 1)';
    element.secondaryColor = 'rgba(0, 0, 0, 1)';
    element.thickness = 5;
    element.translate = { x: 10, y: 10};
  });

  it('should be created', () => {
    const testService: RectangleService = TestBed.get(RectangleService);
    expect(testService).toBeTruthy();
  });

  // TESTS getWidth

  it('#getWidth devrait retourner la largeur', () => {
    let test = element.getWidth();
    expect(test).toEqual(90);
    element.points[0].x = 100;
    element.points[1].x = 10;
    test = element.getWidth();
    expect(test).toEqual(90);
  });

  // TESTS getHeight

  it('#getHeight devrait retourner la hauteur', () => {
    let test = element.getHeight();
    expect(test).toEqual(90);
    element.points[0].y = 100;
    element.points[1].y = 10;
    test = element.getHeight();
    expect(test).toEqual(90);
  });

  // TESTS draw

  it('#draw devrait satisfaire les conditions pour appeler drawLine()', () => {
    element.points[0].x = 0;
    element.points[1].x = 0;
    element.points[0].y = 0;
    element.points[1].y = 0;
    spyOn(element, 'drawLine');
    element.draw();
    expect(element.drawLine).toHaveBeenCalled();
  });

  it('#draw ne devrait pas satisfaire les conditions pour appeler drawLine() avec width et height pas à 0', () => {
    spyOn(element, 'drawLine');
    element.draw();
    expect(element.drawLine).not.toHaveBeenCalled();
  });

  it('#draw devrait  appeler drawRectangle() en ne satisfaisant pas les conditions pour avec chosenOption à \'Plein\'', () => {
    element.points[0].x = 0;
    element.points[1].x = 0;
    element.points[0].y = 0;
    element.points[1].y = 0;
    element.chosenOption = 'Plein';
    spyOn(element, 'drawRectangle');
    element.draw();
    expect(element.drawRectangle).toHaveBeenCalled();
  });

  it('#draw devrait appeler drawPerimeter', () => {
    spyOn(element, 'drawPerimeter');
    element.draw();
    expect(element.drawPerimeter).toHaveBeenCalled();
  });

  // TESTS drawLine

  it('#drawLine devrait retourner le bon svg', () => {
    const test = '<line stroke-linecap="square'
    + '" stroke="' + element.secondaryColor
    + '" stroke-width="' + element.thickness
    + (element.isDotted ? '"stroke-dasharray="2, 8"'  : '')
    + '" x1="' + element.points[0].x + '" y1="' + element.points[0].y
    + '" x2="' + (element.points[0].x + element.getWidth())
    + '" y2="' + (element.points[0].y + element.getHeight()) + '"/>';

    element.drawLine();
    expect(element.svg).toEqual(test);
  });

  // TESTS drawRectangle

  it('#drawRectangle devrait retourner le bon svg', () => {
    const test = '<rect transform=" translate(' + element.translate.x + ' ' + element.translate.y +
    ')" fill="' + ((element.chosenOption !== 'Contour') ? element.primaryColor : 'none')
    + '" stroke="' + ((element.chosenOption !== 'Plein') ? element.secondaryColor : 'none')
    + (element.isDotted ? '"stroke-dasharray="4, 4"'  : '')
    + '" stroke-width="' + element.thickness
    + '" x="' + element.points[0].x + '" y="' + element.points[0].y
    + '" width="' + element.getWidth() + '" height="' + element.getHeight() + '"/>';

    element.drawRectangle();
    expect(element.svg).toEqual(test);
  });

  // TESTS drawPerimeter
/*
  it('#drawPerimeter devrait retourner le bon svg', () => {
    const test = 

    element.drawPerimeter();
    expect(element.svg).toEqual(test);
  });*/
/*
  // TODO : Déplacer les tests de création de SVG vers RectangleService

  // TESTS SUR LA CRÉATION DE RECTANGLES

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
});
