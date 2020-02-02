import { TestBed } from '@angular/core/testing';

import { DessinRectangleService } from './dessin-rectangle.service';
import { StockageSvgService } from './stockage-svg.service';

describe('DessinRectangleService', () => {
  let service: DessinRectangleService;
  let stockageService: StockageSvgService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(DessinRectangleService));
  beforeEach(() => stockageService = TestBed.get(StockageSvgService));
  beforeEach(() => service.xInitial = 0);
  beforeEach(() => service.yInitial = 0);
  // Mettre l'outil de rectangle comme l'outil actif
  beforeEach(() => service.outils.outilActif = service.outils.listeOutils[2]);

  it('should be created', () => {
    const testService: DessinRectangleService = TestBed.get(DessinRectangleService);
    expect(testService).toBeTruthy();
  });

  it('#onMouseMoveRectangle ne devrait rien faire si rectangleEnCours est faux', () => {
    service.rectangleEnCours = false;
    stockageService.setSVGEnCours('<svg class="test"/>');
    // on simule un déplacement de souris quelconque
    service.onMouseMoveRectangle(new MouseEvent('mousemove'));
    // on vérifie que le SVG n'a pas été modifié
    expect(stockageService.getSVGEnCours() + '"/>').toEqual('<svg class="test"/>');
  });

  it('#onMouseMoveRectangle devrait former un carré si shift est enfoncé', () => {
    service.rectangleEnCours = true;
    // on simule un mouvement de 20 en x et de 50 en y
    const event = new MouseEvent('mousemove', { shiftKey: true, clientX: 20, clientY: 50 });
    service.onMouseMoveRectangle(event);
    // on vérifie que la forme tracée est un carré de 20px de côté
    expect(service.largeur).toBe(20);
    expect(service.hauteur).toBe(20);
  });

  it("#onMousePressRectangle devrait avoir rectangleEnCours vrai apres un clic s'il est deja vrai", () => {
      service.rectangleEnCours = true;
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
    service.rectangleEnCours = true;
    // on effectue un clic dans cette fonction
    service.onMouseReleaseRectangle(new MouseEvent('onclick'));
    // on vérifie que la fonction met rectangleEnCours faux
    expect(service.rectangleEnCours).toBe(false);
  })

  it("#onMouseReleaseRectangle devrait s'assurer que le curseur n'est pas nul" +
      'en hauteur et largeur apres un relachement de clic', () => {
    service.rectangleEnCours = true;
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
