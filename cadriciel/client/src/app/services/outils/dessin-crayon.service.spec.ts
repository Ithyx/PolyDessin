import { TestBed } from '@angular/core/testing';

// import { AjoutSvgService } from '../commande/ajout-svg.service';
import { ElementDessin } from '../stockage-svg/element-dessin';
import { StockageSvgService } from '../stockage-svg/stockage-svg.service';
import { TraitCrayonService } from '../stockage-svg/trait-crayon.service';
import { DessinCrayonService } from './dessin-crayon.service';

describe('DessinCrayonService', () => {
  // const SVGCircle = '<circle cx="100" cy="100" r="2.5" fill="rgba(0, 0, 0, 1)"/>';
  // const SVGPath = '<path fill="transparent" stroke="rgba(0, 0, 0, 1)" stroke-linecap="round" stroke-width="5" d="M100 100"/>';
  let service: DessinCrayonService;
  let stockageService: StockageSvgService;
  let element: ElementDessin;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(DessinCrayonService));
  beforeEach(() => stockageService = TestBed.get(StockageSvgService));

  // Mettre l'outil crayon comme l'outil actif
  beforeEach(() => {
    service.commandes.dessinEnCours = true;
    service.peutCliquer = true;
    service.outils.outilActif = service.outils.listeOutils[0];
    service.outils.outilActif.parametres[0].valeur = 5;
    element = new TraitCrayonService();
    stockageService.setSVGEnCours(element);
    service.trait.SVG = 'L';
  });

  it('should be created', () => {
    const testService: DessinCrayonService = TestBed.get(DessinCrayonService);
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

  it("#sourisCliquee devrait mettre dessinEnCours faux si peutCliquer est vrai et que l'outil crayon n'est pas sélectionné", () => {
    service.outils.outilActif.parametres[0].valeur = 0;
    service.sourisCliquee(new MouseEvent('onclick'));
    expect(service.commandes.dessinEnCours).toBe(false);
  });

  it("#sourisCliquee devrait seulement être appelé si l'outil crayon est sélectionné", () => {
    service.outils.outilActif.parametres[0].valeur = 0;
    service.trait.estPoint = false;
    service.sourisCliquee(new MouseEvent('onclick'));
    expect(service.trait.estPoint).toBe(false);
  });

  it('#sourisCliquee devrait appeler actualiserSVG après un clic avec crayon', () => {
    const clic = new MouseEvent('click', { clientX: 100, clientY: 100 });
    spyOn(service, 'actualiserSVG');
    service.sourisCliquee(clic);
    expect(service.actualiserSVG).toHaveBeenCalled();
  });
/*
  it('#sourisCliquee devrait appeler executer de commande après un clic avec crayon', () => {
    const clic = new MouseEvent('click', { clientX: 100, clientY: 100 });
    spyOn(service.commandes, 'executer');
    service.sourisCliquee(clic);
    expect(service.commandes.executer).toHaveBeenCalledWith(new AjoutSvgService(service.trait, service.stockageSVG));
  });*/

  it('#sourisCliquee devrait mettre dessinEnCours faux si peutCliquer est vrai', () => {
    service.sourisCliquee(new MouseEvent('onclick'));
    expect(service.commandes.dessinEnCours).toBe(false);
  });

  it('#sourisCliquee devrait mettre réinitialiser trait à ses paramètres par défaut si peutCliquer est vrai', () => {
    service.sourisCliquee(new MouseEvent('onclick'));
    expect(service.trait).toEqual(new TraitCrayonService());
  });

  // TESTS sourisDeplacee

  it('#sourisDeplacee devrait rien effectuer si dessinEnCours est faux', () => {
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
/*
  it("#sourisRelachee devrait changer peutCliquer à vrai si SVG de trait ne contient pas 'L'", () => {
    service.trait.SVG = 'P';
    spyOn(service.commandes, 'executer');
    service.sourisRelachee();
    expect(service.commandes.executer).toHaveBeenCalledWith(new AjoutSvgService(service.trait, service.stockageSVG));
  });

  it("#sourisRelachee  devrait appeler executer de commandes si le SVG contient 'L'", () => {
    spyOn(service.commandes, 'executer');
    service.sourisRelachee();
    expect(service.commandes.executer).toHaveBeenCalledWith(new AjoutSvgService(service.trait, service.stockageSVG));
  });*/

  it('#sourisRelachee devrait mettre réinitialiser trait à ses paramètres par défaut si dessinEnCours est vrai', () => {
    service.sourisRelachee();
    expect(service.trait).toEqual(new TraitCrayonService());
  });

  it('#sourisRelachee devrait mettre dessinEnCours faux si dessinEnCours est vrai au debut de la fonction', () => {
    service.sourisRelachee();
    expect(service.commandes.dessinEnCours).toBe(false);
  });

  it('#sourisRelachee devrait mettre peutCliquer vrai si dessinEnCours est vrai au debut de la fonction', () => {
    service.sourisRelachee();
    expect(service.peutCliquer).toBe(true);
  });
/*
  // TESTS sourisSortie

  it('#sourisSortie ne devrait pas appeler setSVGEnCours si traitEnCours est faux', () => {
    service.commandes.dessinEnCours = false;
    spyOn(stockageService, 'ajouterSVG');
    service.sourisSortie();
    expect(stockageService.ajouterSVG).not.toHaveBeenCalled();
  });

  it('#sourisSortie devrait appeler ajouterSVG', () => {
    spyOn(stockageService, 'ajouterSVG');
    service.sourisSortie();
    expect(stockageService.ajouterSVG).toHaveBeenCalled();
  });

  it('#sourisSortie devrait appeler setSVGEnCours', () => {
    spyOn(stockageService, 'setSVGEnCours');
    service.sourisSortie();
    expect(stockageService.setSVGEnCours).toHaveBeenCalled();
  });

  it('#sourisSortie devrait mettre traitEnCours faux si traitEnCours est vrai', () => {
    service.sourisSortie();
    expect(service.commandes.dessinEnCours).toBe(false);
  });

  it('#sourisSortie devrait mettre peutCliquer faux si traitEnCours est faux', () => {
    service.commandes.dessinEnCours = false;
    service.sourisSortie();
    expect(service.peutCliquer).toBe(false);
  });*/
});
