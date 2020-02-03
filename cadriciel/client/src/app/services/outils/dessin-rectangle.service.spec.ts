import { TestBed } from '@angular/core/testing';

import { StockageSvgService } from '../stockage-svg.service';
import { DessinRectangleService } from './dessin-rectangle.service';

describe('DessinRectangleService', () => {
  const referenceSVG = '<rect fill="transparent" stroke="black" stroke-width="5" x="0" y="0" width="20" height="50"/>';
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

  // TESTS DE ONMOUSEMOVE

  it('#onMouseMoveRectangle ne devrait rien faire si rectangleEnCours est faux', () => {
    service.rectangleEnCours = false;
    stockageService.setSVGEnCours('<rect class="test"/>');
    // on simule un déplacement de souris quelconque
    service.onMouseMoveRectangle(new MouseEvent('mousemove'));
    // on vérifie que le SVG n'a pas été modifié
    expect(stockageService.getSVGEnCours() + '"/>').toEqual('<rect class="test"/>');
  });
  it('#onMouseMoveRectangle devrait calculer la largeur et la hauteur', () => {
    // on simule un mouvement de 50 en x et en y
    const evenement = new MouseEvent('mousemove', { clientX: 50, clientY: 50 });
    service.onMouseMoveRectangle(evenement);
    // on vérifie que la largeur et la hauteur ont les bonnes valeurs
    expect(service.largeur).toBe(50);
    expect(service.hauteur).toBe(50);
  });
  it('#onMouseMoveRectangle devrait calculer correctement la largeur et la hauteur '
    + 'pour un déplacement avec des valeurs négatives', () => {
    // on simule un mouvement de -50 en x et en y
    const evenement = new MouseEvent('mousemove', { clientX: -50, clientY: -50 });
    service.onMouseMoveRectangle(evenement);
    // on vérifie que la largeur et la hauteur ont les bonnes valeurs
    expect(service.largeur).toBe(50);
    expect(service.hauteur).toBe(50);
  });
  it('#onMouseMoveRectangle devrait calculer la base en X et en Y', () => {
    // on simule un mouvement de 50 en x et en y
    const evenement = new MouseEvent('mousemove', { clientX: 50, clientY: 50 });
    service.onMouseMoveRectangle(evenement);
    // on vérifie que les coordonnées de la base ont les bonnes valeurs
    expect(service.baseX).toBe(0);
    expect(service.baseY).toBe(0);
  });
  it('#onMouseMoveRectangle devrait calculer correctement la base en X et en Y '
    + 'pour un déplacement avec des valeurs négatives', () => {
    // on simule un mouvement de -50 en x et en y
    const evenement = new MouseEvent('mousemove', { clientX: -50, clientY: -50 });
    service.onMouseMoveRectangle(evenement);
    // on vérifie que les coordonnées de la base ont ont les bonnes valeurs
    expect(service.baseX).toBe(-50);
    expect(service.baseY).toBe(-50);
  });
  it('#onMouseMoveRectangle devrait former un carré si shift est enfoncé', () => {
    // on simule un déplacement de souris avec shift enfoncé
    spyOn(service, 'onShiftPressedRectangle');
    service.onMouseMoveRectangle(new MouseEvent('mousemove', { shiftKey: true }));
    // on vérifie que la fonction pour former un carré a été appelée
    expect(service.onShiftPressedRectangle).toHaveBeenCalled();
  });
  it("#onMouseMoveRectangle devrait former un rectangle (ou une ligne) si shift n'est pas enfoncé", () => {
    // on simule un déplacement de souris sans shift enfoncé
    spyOn(service, 'onShiftReleasedRectangle');
    service.onMouseMoveRectangle(new MouseEvent('mousemove', { shiftKey: false }));
    // on vérifie que la fonction pour former un rectangle a été appelée
    expect(service.onShiftReleasedRectangle).toHaveBeenCalled();
  });

  // TESTS DE ONSHIFTRELEASED

  it('#onShiftReleasedRectangle ne devrait rien faire si rectangleEnCours est faux', () => {
    service.rectangleEnCours = false;
    spyOn(service, 'actualiserSVG');
    service.onShiftReleasedRectangle();
    expect(service.actualiserSVG).not.toHaveBeenCalled();
  });
  it('#onShiftReleasedRectangle devrait actualise le SVG si rectangleEnCours est faux', () => {
    spyOn(service, 'actualiserSVG');
    service.onShiftReleasedRectangle();
    expect(service.actualiserSVG).toHaveBeenCalled();
  });

  // TESTS DE ONSHIFTPRESSED

  it('#onShiftPressedRectangle ne devrait rien faire si rectangleEnCours est faux', () => {
    service.rectangleEnCours = false;
    spyOn(service, 'actualiserSVG');
    service.onShiftPressedRectangle();
    expect(service.actualiserSVG).not.toHaveBeenCalled();
  });
  it('#onShiftPressedRectangle devrait actualise le SVG si rectangleEnCours est faux', () => {
    spyOn(service, 'actualiserSVG');
    service.onShiftPressedRectangle();
    expect(service.actualiserSVG).toHaveBeenCalled();
  });
  it('#onShiftPressedRectangle devrait corriger la largeur si elle est plus grande '
    + 'que la hauteur', () => {
    service.largeurCalculee = 100;
    service.hauteurCalculee = 50;
    service.onShiftPressedRectangle();
    expect(service.largeur).toBe(50);
  });
  it('#onShiftPressedRectangle devrait corriger la hauteur si elle est plus grande '
    + 'que la largeur', () => {
    service.largeurCalculee = 50;
    service.hauteurCalculee = 100;
    service.onShiftPressedRectangle();
    expect(service.hauteur).toBe(50);
  });
  it('#onShiftPressedRectangle devrait corriger la base en Y si elle diffère '
    + 'du Y initial et que la largeur est supérieure à la hauteur', () => {
    service.baseYCalculee = 50;
    service.largeurCalculee = 5;
    service.hauteurCalculee = 10;
    service.onShiftPressedRectangle();
    expect(service.baseY).toBe(55);
  });
  it('#onShiftPressedRectangle devrait corriger la base en X si elle diffère '
    + 'du X initial et que la hauteur est supérieure à la largeur', () => {
    service.baseXCalculee = 50;
    service.largeurCalculee = 10;
    service.hauteurCalculee = 5;
    service.onShiftPressedRectangle();
    expect(service.baseX).toBe(55);
  });

  // TESTS SUR LA CRÉATION DE RECTANGLES

  it("#actualiserSVG devrait tracer un rectangle lors d'un mouvement "
    + 'vers le coin inférieur droit', () => {
    // on simule un mouvement de 20 en x et de 50 en y
    const evenement = new MouseEvent('mousemove', { clientX: 20, clientY: 50 });
    service.onMouseMoveRectangle(evenement);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours() + '"/>').toEqual(referenceSVG);
  });
  it("#actualiserSVG devrait tracer un rectangle lors d'un mouvement "
    + 'vers le coin supérieur droit', () => {
    // on simule un mouvement de 20 en x et de -50 en y
    service.yInitial = 50;
    const evenement = new MouseEvent('mousemove', { clientX: 20, clientY: 0 });
    service.onMouseMoveRectangle(evenement);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours() + '"/>').toEqual(referenceSVG);
  });
  it("#actualiserSVG devrait tracer un rectangle lors d'un mouvement "
    + 'vers le coin inférieur gauche', () => {
    // on simule un mouvement de -20 en x et de 50 en y
    service.xInitial = 20;
    const evenement = new MouseEvent('mousemove', { clientX: 0, clientY: 50 });
    service.onMouseMoveRectangle(evenement);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours() + '"/>').toEqual(referenceSVG);
  });
  it("#actualiserSVG devrait tracer un rectangle lors d'un mouvement "
    + 'vers le coin supérieur gauche', () => {
    // on simule un mouvement de -20 en x et de -50 en y
    service.xInitial = 20;
    service.yInitial = 50;
    const evenement = new MouseEvent('mousemove', { clientX: 0, clientY: 0 });
    service.onMouseMoveRectangle(evenement);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours() + '"/>').toEqual(referenceSVG);
  });

  // TESTS SUR LA CRÉATION DE LIGNES

  it('#actualiserSVG devrait tracer une ligne si la hauteur est nulle', () => {
    // on simule un mouvement de 20 en x et de 0 en y
    const evenement = new MouseEvent('mousemove', { clientX: 20, clientY: 0 });
    service.onMouseMoveRectangle(evenement);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours()).toContain('<line');
  });
  it('#actualiserSVG devrait tracer une ligne si la largeur est nulle', () => {
    // on simule un mouvement de 0 en x et de 20 en y
    const evenement = new MouseEvent('mousemove', { clientX: 0, clientY: 20 });
    service.onMouseMoveRectangle(evenement);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours()).toContain('<line');
  });
  it('#actualiserSVG ne devrait pas tracer de ligne si le tracé est plein sans contour', () => {
    // on simule un mouvement de 0 en x et de 20 en y
    service.outils.outilActif.parametres[1].optionChoisie = 'Plein';
    const evenement = new MouseEvent('mousemove', { clientX: 0, clientY: 20 });
    service.onMouseMoveRectangle(evenement);
    // on vérifie le SVG qui a été tracé
    expect(stockageService.getSVGEnCours()).toContain('<rect');
  });

  // TESTS SUR LA CRÉATION DE PÉRIMÈTRES

  it("#actualiserSVG devrait tracer un périmètre en prenant en compte l'épaisseur "
    + "s'il y a un contour", () => {
    // on simule un mouvement de 20 en x et de 50 en y
    const evenement = new MouseEvent('mousemove', { clientX: 20, clientY: 50 });
    service.onMouseMoveRectangle(evenement);
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
    service.onMouseMoveRectangle(evenement);
    // on vérifie le périmètre qui a été tracé
    expect(String(stockageService.getPerimetreEnCoursHTML())).toContain(
      'x="0" y="0" height="50" width="20"'
    );
  });
  it("#actualiserSVG devrait tracer un périmètre autour d'une ligne "
    + 'dans le cas où une ligne est tracée', () => {
    // on simule un mouvement de 0 en x et de 20 en y
    const evenement = new MouseEvent('mousemove', { clientX: 0, clientY: 20 });
    service.onMouseMoveRectangle(evenement);
    // on vérifie le périmètre qui a été tracé
    expect(String(stockageService.getPerimetreEnCoursHTML())).toContain(
      'x="-2.5" y="-2.5" height="25" width="5"'
    );
  });

  // TESTS DE ONMOUSEPRESS

  it("#onMousePressRectangle devrait avoir rectangleEnCours vrai apres un clic s'il est deja vrai", () => {
      // on effectue un clic dans cette fonction
      service.onMousePressRectangle(new MouseEvent('onclick'));
      // on vérifie que la fonction ne fait rien puisque rectangle est deja vrai
      expect(service.rectangleEnCours).toBe(true);
  });
  it('#onMousePressRectangle devrait mettre rectangleEnCours vrai apres un clic', () => {
    service.rectangleEnCours = false;
    // on effectue un clic dans cette fonction
    service.onMousePressRectangle(new MouseEvent('onclick'));
    // on vérifie que la fonction met rectangleEnCours vrai
    expect(service.rectangleEnCours).toBe(true);
  });
  it('#onMousePressRectangle devrait contenir les coordonnees initiale du clic', () => {
    service.rectangleEnCours = false;
    service.xInitial = 200; service.yInitial = 200;
    // on fait un clic aux coordonnees (100,50)
    const clic = new MouseEvent('click', { clientX: 100, clientY: 50 });
    service.onMousePressRectangle(clic);
    // on vérifie que la fonction contient les coordonnees correctement
    expect(service.xInitial).toBe(100);
    expect(service.yInitial).toBe(50);
  });
  it('#onMousePressRectangle devrait contenir les coordonnees initiale du clic', () => {
    service.rectangleEnCours = false;
    service.hauteur = 100; service.largeur = 100;
    // on fait un clic aux coordonnees (100,50)
    const clic = new MouseEvent('click', { clientX: 100, clientY: 50 });
    service.onMousePressRectangle(clic);
    // on vérifie que la fonction contient la largeur et longueur à 0
    expect(service.hauteur).toBe(0);
    expect(service.largeur).toBe(0);
  });

  // TESTS DE ONMOUSERELEASE

  it('#onMouseReleaseRectangle devrait mettre rectangleEnCours faux apres un clic', () => {
    // on effectue un clic dans cette fonction
    service.onMouseReleaseRectangle(new MouseEvent('release'));
    // on vérifie que la fonction met rectangleEnCours faux
    expect(service.rectangleEnCours).toBe(false);
  });
  it("#onMouseReleaseRectangle devrait s'assurer que le curseur n'est pas nul " +
      'en hauteur et largeur apres un relachement de clic', () => {
    // la hauteur et la largeur sont nulles
    service.hauteur = 0;
    service.largeur = 0;
    spyOn(stockageService, 'ajouterSVG');
    service.onMouseReleaseRectangle(new MouseEvent('release'));
    // vérifier que la fonction ajouterSVG n'a pas été appelée
    expect(stockageService.ajouterSVG).not.toHaveBeenCalled();
  });
  it('#onMouseReleaseRectangle devrait appeler correctement la fonction ajouterSVG', () => {
    stockageService.setSVGEnCours(referenceSVG);
    // la hauteur et la largeur sont non nulles
    service.hauteur = 10;
    service.largeur = 10;
    spyOn(stockageService, 'ajouterSVG');
    service.onMouseReleaseRectangle(new MouseEvent('release'));
    // vérifier que la fonction ajouterSVG a été correctement appelée
    expect(stockageService.ajouterSVG).toHaveBeenCalledWith(referenceSVG);
  });
  it('#onMouseReleaseRectange devrait vider le périmètre et le SVG en cours', () => {
    stockageService.setSVGEnCours(referenceSVG);
    service.onMouseReleaseRectangle(new MouseEvent('release'));
    // vérifier que le SVG est vide
    expect(stockageService.getSVGEnCours()).toEqual('');
  });
});
