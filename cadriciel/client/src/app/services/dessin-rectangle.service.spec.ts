import { TestBed } from '@angular/core/testing';

import { DessinRectangleService } from './dessin-rectangle.service';

describe('DessinRectangleService', () => {
  let service: DessinRectangleService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(DessinRectangleService));

  it('should be created', () => {
    const testService: DessinRectangleService = TestBed.get(DessinRectangleService);
    expect(testService).toBeTruthy();
  });

  it("#onMousePressRectangle devrait avoir rectangleEnCours vrai apres un clic s'il est deja vrai", () => {
      service.rectangleEnCours = true;
      // on effectue un clic dans cette fonction
      service.onMousePressRectangle(new MouseEvent('onclick'));
      // on vérifie que la fonction ne fait rien puisque rectangle est deja vrai
      expect(service.rectangleEnCours).toBe(true);
    })

  it('#onMousePressRectangle devrait mettre rectangleEnCours actif apres un clic', () => {
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
  
});