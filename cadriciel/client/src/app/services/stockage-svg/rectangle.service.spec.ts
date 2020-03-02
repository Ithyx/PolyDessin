import { TestBed } from '@angular/core/testing';

import { RectangleService } from './rectangle.service';

describe('RectangleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    expect(service).toBeTruthy();
  });

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
});
