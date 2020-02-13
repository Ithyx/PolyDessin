import { TestBed } from '@angular/core/testing';

import { StockageSvgService } from '../stockage-svg.service';
import { DessinRectangleService } from './dessin-rectangle.service';

describe('DessinRectangleService', () => {
  const referenceSVG = '<rect fill="transparent" stroke="rgba(0, 0, 0, 1)" stroke-width="5" x="0" y="0" width="20" height="50"/>';
  let service: DessinRectangleService;
  let stockageService: StockageSvgService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(DessinRectangleService));
  beforeEach(() => stockageService = TestBed.get(StockageSvgService));
  beforeEach(() => {
    service.initial.x = 0;
    service.initial.y = 0;
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

  // TESTS DE SOURIS DEPLACEE

  it('#sourisDeplacee ne devrait rien faire si rectangleEnCours est faux', () => {
    service.rectangleEnCours = false;
    stockageService.setSVGEnCours('<rect class="test"/>');
    // on simule un déplacement de souris quelconque
    service.sourisDeplacee(new MouseEvent('mousemove'));
    // on vérifie que le SVG n'a pas été modifié
    expect(stockageService.getSVGEnCours() + '"/>').toEqual('<rect class="test"/>');
  });
  it('#sourisDeplacee devrait calculer la largeur et la hauteur', () => {
    // on simule un mouvement de 50 en x et en y
    const evenement = new MouseEvent('mousemove', { clientX: 50, clientY: 50 });
    service.sourisDeplacee(evenement);
    // on vérifie que la largeur et la hauteur ont les bonnes valeurs
    expect(service.largeur).toBe(50);
    expect(service.hauteur).toBe(50);
  });
  it('#sourisDeplacee devrait calculer correctement la largeur et la hauteur '
    + 'pour un déplacement avec des valeurs négatives', () => {
    // on simule un mouvement de -50 en x et en y
    const evenement = new MouseEvent('mousemove', { clientX: -50, clientY: -50 });
    service.sourisDeplacee(evenement);
    // on vérifie que la largeur et la hauteur ont les bonnes valeurs
    expect(service.largeur).toBe(50);
    expect(service.hauteur).toBe(50);
  });
  it('#sourisDeplacee devrait calculer la base en X et en Y', () => {
    // on simule un mouvement de 50 en x et en y
    const evenement = new MouseEvent('mousemove', { clientX: 50, clientY: 50 });
    service.sourisDeplacee(evenement);
    // on vérifie que les coordonnées de la base ont les bonnes valeurs
    expect(service.base.x).toBe(0);
    expect(service.base.y).toBe(0);
  });
  it('#sourisDeplacee devrait calculer correctement la base en X et en Y '
    + 'pour un déplacement avec des valeurs négatives', () => {
    // on simule un mouvement de -50 en x et en y
    const evenement = new MouseEvent('mousemove', { clientX: -50, clientY: -50 });
    service.sourisDeplacee(evenement);
    // on vérifie que les coordonnées de la base ont ont les bonnes valeurs
    expect(service.base.x).toBe(-50);
    expect(service.base.y).toBe(-50);
  });
  it('#sourisDeplacee devrait former un carré si shift est enfoncé', () => {
    // on simule un déplacement de souris avec shift enfoncé
    spyOn(service, 'shiftEnfonce');
    service.sourisDeplacee(new MouseEvent('mousemove', { shiftKey: true }));
    // on vérifie que la fonction pour former un carré a été appelée
    expect(service.shiftEnfonce).toHaveBeenCalled();
  });
  it("#sourisDeplacee devrait former un rectangle (ou une ligne) si shift n'est pas enfoncé", () => {
    // on simule un déplacement de souris sans shift enfoncé
    spyOn(service, 'shiftRelache');
    service.sourisDeplacee(new MouseEvent('mousemove', { shiftKey: false }));
    // on vérifie que la fonction pour former un rectangle a été appelée
    expect(service.shiftRelache).toHaveBeenCalled();
  });

  // TESTS DE SHIFT RELACHE

  it('#shiftRelache ne devrait rien faire si rectangleEnCours est faux', () => {
    service.rectangleEnCours = false;
    spyOn(service, 'actualiserSVG');
    service.shiftRelache();
    expect(service.actualiserSVG).not.toHaveBeenCalled();
  });
  it('#shiftRelache devrait actualise le SVG si rectangleEnCours est faux', () => {
    spyOn(service, 'actualiserSVG');
    service.shiftRelache();
    expect(service.actualiserSVG).toHaveBeenCalled();
  });

  // TESTS DE SHIFT ENFONCE

  it('#shiftEnfonce ne devrait rien faire si rectangleEnCours est faux', () => {
    service.rectangleEnCours = false;
    spyOn(service, 'actualiserSVG');
    service.shiftEnfonce();
    expect(service.actualiserSVG).not.toHaveBeenCalled();
  });
  it('#shiftEnfonce devrait actualise le SVG si rectangleEnCours est faux', () => {
    spyOn(service, 'actualiserSVG');
    service.shiftEnfonce();
    expect(service.actualiserSVG).toHaveBeenCalled();
  });
  it('#shiftEnfonce devrait corriger la largeur si elle est plus grande '
    + 'que la hauteur', () => {
    service.largeurCalculee = 100;
    service.hauteurCalculee = 50;
    service.shiftEnfonce();
    expect(service.largeur).toBe(50);
  });
  it('#shiftEnfonce devrait corriger la hauteur si elle est plus grande '
    + 'que la largeur', () => {
    service.largeurCalculee = 50;
    service.hauteurCalculee = 100;
    service.shiftEnfonce();
    expect(service.hauteur).toBe(50);
  });
  it('#shiftEnfonce devrait corriger la base en Y si elle diffère '
    + 'du Y initial et que la largeur est supérieure à la hauteur', () => {
    service.baseCalculee.y = 50;
    service.largeurCalculee = 5;
    service.hauteurCalculee = 10;
    service.shiftEnfonce();
    expect(service.base.y).toBe(55);
  });
  it('#shiftEnfonce ne devrait pas corriger la base en Y si elle est égale '
    + 'au Y initial et que la largeur est supérieure à la hauteur', () => {
    service.baseCalculee.y = 0;
    service.largeurCalculee = 5;
    service.hauteurCalculee = 10;
    service.shiftEnfonce();
    expect(service.base.y).toBe(0);
  });
  it('#shiftEnfonce devrait corriger la base en X si elle diffère '
    + 'du X initial et que la hauteur est supérieure à la largeur', () => {
    service.baseCalculee.x = 50;
    service.largeurCalculee = 10;
    service.hauteurCalculee = 5;
    service.shiftEnfonce();
    expect(service.base.x).toBe(55);
  });
  it('#shiftEnfonce ne devrait pas corriger la base en X si elle est égale '
    + 'au X initial et que la hauteur est supérieure à la largeur', () => {
    service.baseCalculee.x = 0;
    service.largeurCalculee = 10;
    service.hauteurCalculee = 5;
    service.shiftEnfonce();
    expect(service.base.x).toBe(0);
  });

  // TESTS SUR LA CRÉATION DE RECTANGLES

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
      ]
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
  });

  // TESTS DE SOURIS ENFONCEE

  it("#sourisEnfoncee devrait avoir rectangleEnCours vrai apres un clic s'il est deja vrai", () => {
      // on effectue un clic dans cette fonction
      service.sourisEnfoncee(new MouseEvent('onclick'));
      // on vérifie que la fonction ne fait rien puisque rectangle est deja vrai
      expect(service.rectangleEnCours).toBe(true);
  });
  it('#sourisEnfoncee devrait mettre rectangleEnCours vrai apres un clic', () => {
    service.rectangleEnCours = false;
    // on effectue un clic dans cette fonction
    service.sourisEnfoncee(new MouseEvent('onclick'));
    // on vérifie que la fonction met rectangleEnCours vrai
    expect(service.rectangleEnCours).toBe(true);
  });
  it('#sourisEnfoncee devrait contenir les coordonnees initiale du clic', () => {
    service.rectangleEnCours = false;
    service.initial.x = 200; service.initial.y = 200;
    // on fait un clic aux coordonnees (100,50)
    const clic = new MouseEvent('click', { clientX: 100, clientY: 50 });
    service.sourisEnfoncee(clic);
    // on vérifie que la fonction contient les coordonnees correctement
    expect(service.initial.x).toBe(100);
    expect(service.initial.y).toBe(50);
  });
  it('#sourisEnfoncee devrait contenir les coordonnees initiale du clic', () => {
    service.rectangleEnCours = false;
    service.hauteur = 100; service.largeur = 100;
    // on fait un clic aux coordonnees (100,50)
    const clic = new MouseEvent('click', { clientX: 100, clientY: 50 });
    service.sourisEnfoncee(clic);
    // on vérifie que la fonction contient la largeur et longueur à 0
    expect(service.hauteur).toBe(0);
    expect(service.largeur).toBe(0);
  });

  // TESTS DE SOURIS RELACHEE

  it('#sourisRelachee devrait mettre rectangleEnCours faux apres un clic', () => {
    // on effectue un clic dans cette fonction
    service.sourisRelachee(new MouseEvent('release'));
    // on vérifie que la fonction met rectangleEnCours faux
    expect(service.rectangleEnCours).toBe(false);
  });
  it("#sourisRelachee devrait s'assurer que le curseur n'est pas nul " +
      'en hauteur et largeur apres un relachement de clic', () => {
    // la hauteur et la largeur sont nulles
    service.hauteur = 0;
    service.largeur = 0;
    spyOn(stockageService, 'ajouterSVG');
    service.sourisRelachee(new MouseEvent('release'));
    // vérifier que la fonction ajouterSVG n'a pas été appelée
    expect(stockageService.ajouterSVG).not.toHaveBeenCalled();
  });
  it('#sourisRelachee devrait appeler correctement la fonction ajouterSVG', () => {
    stockageService.setSVGEnCours(referenceSVG);
    // la hauteur et la largeur sont non nulles
    service.hauteur = 10;
    service.largeur = 10;
    spyOn(stockageService, 'ajouterSVG');
    service.sourisRelachee(new MouseEvent('release'));
    // vérifier que la fonction ajouterSVG a été correctement appelée
    expect(stockageService.ajouterSVG).toHaveBeenCalledWith(referenceSVG);
  });
  it('#sourisRelachee devrait vider le périmètre et le SVG en cours', () => {
    stockageService.setSVGEnCours(referenceSVG);
    service.sourisRelachee(new MouseEvent('release'));
    // vérifier que le SVG est vide
    expect(stockageService.getSVGEnCours()).toEqual('');
  });

  // TESTS vider

  it('#vider devrait mettre rectangleEnCours faux', () => {
    service.vider();
    expect(service.rectangleEnCours).toBe(false);
  });

  it('#vider devrait appeler setPerimetreEnCours', () => {
    spyOn(stockageService, 'setPerimetreEnCours')
    service.vider();
    expect(stockageService.setPerimetreEnCours).toHaveBeenCalledWith('');
  });

  it('#vider devrait appeler setSVGEnCours', () => {
    spyOn(stockageService, 'setSVGEnCours')
    service.vider();
    expect(stockageService.setSVGEnCours).toHaveBeenCalledWith('');
  });
});
