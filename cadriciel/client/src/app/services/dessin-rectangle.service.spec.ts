import { TestBed } from '@angular/core/testing';

import { DessinRectangleService } from './dessin-rectangle.service';
import { StockageSvgService } from './stockage-svg.service';

describe('DessinRectangleService', () => {
  const referenceSVGRectangle = '<rect fill="transparent" stroke="black" stroke-width="5" x="0" y="0" width="20" height="50"/>';
  let service: DessinRectangleService;
  let stockageService: StockageSvgService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(DessinRectangleService));
  beforeEach(() => stockageService = TestBed.get(StockageSvgService));
  beforeEach(() => {
    service.xInitial = 0;
    service.yInitial = 0;
    service.couleurPrimaire = 'blue';
    service.couleurSecondaire = 'black';
    service.rectangleEnCours = true;
  });
  // Mettre l'outil de rectangle comme l'outil actif
  beforeEach(() => {
    service.outils.outilActif = service.outils.listeOutils[2];
    service.outils.outilActif.parametres[1].optionChoisie = 'Contour';
    service.outils.outilActif.parametres[0].valeur = 5;
  });

  it('should be created', () => {
    const testService: DessinRectangleService = TestBed.get(DessinRectangleService);
    expect(testService).toBeTruthy();
  });

  // TODO: Corriger les tests de onMouseMoveRectangle avec la fonction actualiserSVG

  it('#onMouseMoveRectangle ne devrait rien faire si rectangleEnCours est faux', () => {
    service.rectangleEnCours = false;
    stockageService.setSVGEnCours('<rect class="test"/>');
    // on simule un déplacement de souris quelconque
    service.onMouseMoveRectangle(new MouseEvent('mousemove'));
    // on vérifie que le SVG n'a pas été modifié
    expect(stockageService.getSVGEnCours() + '"/>').toEqual('<rect class="test"/>');
  });

  it('#onMouseMoveRectangle devrait former un carré si shift est enfoncé', () => {
    // on simule un mouvement de 20 en x et de 50 en y
    const event = new MouseEvent('mousemove', { shiftKey: true, clientX: 20, clientY: 50 });
    service.onMouseMoveRectangle(event);
    // on vérifie que la forme tracée est un carré de 20px de côté
    expect(service.largeur).toBe(20);
    expect(service.hauteur).toBe(20);
  });

  // TESTS SUR LA CRÉATION DE RECTANGLES
  it("#onMouseMoveRectangle devrait tracer un rectangle lors d'un mouvement"
    + 'vers le coin inférieur droit', () => {
    // on simule un mouvement de 20 en x et de 50 en y
    const event = new MouseEvent('mousemove', { clientX: 20, clientY: 50 });
    service.onMouseMoveRectangle(event);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours() + '"/>').toEqual(referenceSVGRectangle);
  });
  it("#onMouseMoveRectangle devrait tracer un rectangle lors d'un mouvement"
    + 'vers le coin supérieur droit', () => {
    // on simule un mouvement de 20 en x et de -50 en y
    service.yInitial = 50;
    const event = new MouseEvent('mousemove', { clientX: 20, clientY: 0 });
    service.onMouseMoveRectangle(event);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours() + '"/>').toEqual(referenceSVGRectangle);
  });
  it("#onMouseMoveRectangle devrait tracer un rectangle lors d'un mouvement"
    + 'vers le coin inférieur gauche', () => {
    // on simule un mouvement de -20 en x et de 50 en y
    service.xInitial = 20;
    const event = new MouseEvent('mousemove', { clientX: 0, clientY: 50 });
    service.onMouseMoveRectangle(event);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours() + '"/>').toEqual(referenceSVGRectangle);
  });
  it("#onMouseMoveRectangle devrait tracer un rectangle lors d'un mouvement"
    + 'vers le coin supérieur gauche', () => {
    // on simule un mouvement de -20 en x et de -50 en y
    service.xInitial = 20;
    service.yInitial = 50;
    const event = new MouseEvent('mousemove', { clientX: 0, clientY: 0 });
    service.onMouseMoveRectangle(event);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours() + '"/>').toEqual(referenceSVGRectangle);
  });

  // TESTS SUR LA CRÉATION DE LIGNES
  it('#onMouseMoveRectangle devrait tracer une ligne si la hauteur est nulle', () => {
    // on simule un mouvement de 20 en x et de 0 en y
    const event = new MouseEvent('mousemove', { clientX: 20, clientY: 0 });
    service.onMouseMoveRectangle(event);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours()).toContain('<line');
  });
  it('#onMouseMoveRectangle devrait tracer une ligne si la largeur est nulle', () => {
    // on simule un mouvement de 0 en x et de 20 en y
    const event = new MouseEvent('mousemove', { clientX: 0, clientY: 20 });
    service.onMouseMoveRectangle(event);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours()).toContain('<line');
  });
  it('#onMouseMoveRectangle ne devrait pas tracer de ligne si le tracé est plein sans contour', () => {
    // on simule un mouvement de 0 en x et de 20 en y
    service.outils.outilActif.parametres[1].optionChoisie = 'Plein';
    const event = new MouseEvent('mousemove', { clientX: 0, clientY: 20 });
    service.onMouseMoveRectangle(event);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours()).toContain('<rect');
  });

  // TESTS SUR LA CRÉATION DE PÉRIMÈTRES
  it("#onMouseMoveRectangle devrait tracer un périmètre en prenant en compte l'épaisseur"
    + "s'il y a un contour", () => {
    // on simule un mouvement de 20 en x et de 50 en y
    const event = new MouseEvent('mousemove', { clientX: 20, clientY: 50 });
    service.onMouseMoveRectangle(event);
    // on vérifie le périmètre qui a été tracé
    expect(String(stockageService.getPerimetreEnCoursHTML())).toContain(
      'x="-2.5" y="-2.5" height="55" width="25"'
    );
  });
  it("#onMouseMoveRectangle devrait tracer un périmètre sans prendre en compte l'épaisseur"
    + "s'il n'y a pas de contour", () => {
    // on simule un mouvement de 20 en x et de 50 en y
    service.outils.outilActif.parametres[1].optionChoisie = 'Plein';
    const event = new MouseEvent('mousemove', { clientX: 20, clientY: 50 });
    service.onMouseMoveRectangle(event);
    // on vérifie le périmètre qui a été tracé
    expect(String(stockageService.getPerimetreEnCoursHTML())).toContain(
      'x="0" y="0" height="50" width="20"'
    );
  });
  it("#onMouseMoveRectangle devrait tracer un périmètre autour d'une ligne"
    + 'dans le cas où une ligne est tracée', () => {
    // on simule un mouvement de 0 en x et de 20 en y
    const event = new MouseEvent('mousemove', { clientX: 0, clientY: 20 });
    service.onMouseMoveRectangle(event);
    // on vérifie le périmètre qui a été tracé
    expect(String(stockageService.getPerimetreEnCoursHTML())).toContain(
      'x="-2.5" y="-2.5" height="25" width="5"'
    );
  });

  it("#onMousePressRectangle devrait avoir rectangleEnCours vrai apres un clic s'il est deja vrai", () => {
      // on effectue un clic dans cette fonction
      service.onMousePressRectangle(new MouseEvent('onclick'));
      // on vérifie que la fonction ne fait rien puisque rectangle est deja vrai
      expect(service.rectangleEnCours).toBe(true);
    })

  it('#onMousePressRectangle devrait mettre rectangleEnCours vrai apres un clic', () => {
    service.rectangleEnCours = false;
    // on effectue un clic dans cette fonction
    service.onMousePressRectangle(new MouseEvent('onclick'));
    // on vérifie que la fonction met rectangleEnCours vrai
    expect(service.rectangleEnCours).toBe(true);
  })

  it('#onMousePressRectangle devrait contenir les coordonnees initiale du clic', () => {
    service.rectangleEnCours = false;
    service.xInitial = 200; service.yInitial = 200;
    // on fait un clic aux coordonnees (100,50)
    const clic = new MouseEvent('click', { clientX: 100, clientY: 50 });
    service.onMousePressRectangle(clic);
    // on vérifie que la fonction contient les coordonnees correctement
    expect(service.xInitial).toBe(100);
    expect(service.yInitial).toBe(50);
  })

  it('#onMousePressRectangle devrait contenir les coordonnees initiale du clic', () => {
    service.rectangleEnCours = false;
    service.hauteur = 100; service.largeur = 100;
    // on fait un clic aux coordonnees (100,50)
    const clic = new MouseEvent('click', { clientX: 100, clientY: 50 });
    service.onMousePressRectangle(clic);
    // on vérifie que la fonction contient la largeur et longueur à 0
    expect(service.hauteur).toBe(0);
    expect(service.largeur).toBe(0);
  })

  it('#onMouseReleaseRectangle devrait mettre rectangleEnCours faux apres un clic', () => {
    // on effectue un clic dans cette fonction
    service.onMouseReleaseRectangle(new MouseEvent('onclick'));
    // on vérifie que la fonction met rectangleEnCours faux
    expect(service.rectangleEnCours).toBe(false);
  })

  it("#onMouseReleaseRectangle devrait s'assurer que le curseur n'est pas nul" +
      'en hauteur et largeur apres un relachement de clic', () => {
    service.hauteur = 0; service.largeur = 0;
    // on effectue un clic dans cette fonction
    service.onMouseReleaseRectangle(new MouseEvent('onclick'));
    // on vérifie que la fonction garde hauteur et largeur à 0
    expect(service.rectangleEnCours).toBe(false);
    expect(service.hauteur).toBe(0);
    expect(service.largeur).toBe(0);
  })

  // TODO: tests de onMouseRelease liés à l'utilisation du service de stockage SVG
  /*it('#onMouseReleaseRectangle devrait incrementer correctement la fonction ajouterSVG', () =>{
    service.rectangleEnCours = true;
    service.hauteur = 10; service.largeur = 10;
  })*/
});
