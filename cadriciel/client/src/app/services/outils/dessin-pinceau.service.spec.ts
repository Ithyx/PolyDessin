import { TestBed } from '@angular/core/testing';

import { StockageSvgService } from '../stockage-svg.service';
import { DessinPinceauService } from './dessin-pinceau.service';

describe('DessinPinceauService', () => {
  const SVGCircle = '<circle filter="url(#Flou)"  cx="100" cy="100" r="2.5" fill="black"/>';
  const SVGPath = '<path filter="url(#Flou)" fill="transparent" stroke="black" stroke-linecap="round" stroke-width="5" d="M100 100"/>';
  let service: DessinPinceauService;
  let stockageService: StockageSvgService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(DessinPinceauService));
  beforeEach(() => stockageService = TestBed.get(StockageSvgService));

  // Mettre l'outil crayon comme l'outil actif
  beforeEach(() => {
    service.traitEnCours = true;
    service.traitEnCours = true;
    service.outils.outilActif = service.outils.listeOutils[1];
    service.outils.outilActif.parametres[0].valeur = 5;
    stockageService.setSVGEnCours('<svg />');
  });

  it('should be created', () => {
    const testService: DessinPinceauService = TestBed.get(DessinPinceauService);
    expect(testService).toBeTruthy();
  });

  // TESTS sourisCliquee

  it('#sourisCliquee ne devrait pas appeler ajouterSVG si peutCliquer est faux', () => {
    service.peutCliquer = false;
    spyOn(stockageService, 'ajouterSVG');
    service.sourisCliquee(new MouseEvent('onclick'));
    expect(stockageService.ajouterSVG).not.toHaveBeenCalled();
  });

  it("#sourisCliquee devrait seulement être appelé si l'outil crayon est sélectionné", () => {
    service.outils.outilActif = {
      nom : 'outilActifTest' ,
      estActif : true,
      ID : 0,
      parametres: [
        {type: 'select', nom: 'testEpaisseurInvalide', optionChoisie: '1', options: ['1', '2']}
      ]
    }

    spyOn(stockageService, 'ajouterSVG');
    service.sourisCliquee(new MouseEvent('onclick'));
    expect(stockageService.ajouterSVG).not.toHaveBeenCalled();
  });

  it('#sourisCliquee devrait appeler ajouterSVG créer un point après un clic', () => {
    const clic = new MouseEvent('click', { clientX: 100, clientY: 100 });
    spyOn(stockageService, 'ajouterSVG');
    service.sourisCliquee(clic);
    expect(stockageService.ajouterSVG).toHaveBeenCalledWith(SVGCircle);
  });

  it('#sourisCliquee devrait mettre traitEnCours faux', () => {
    service.sourisCliquee(new MouseEvent('onclick'));
    expect(service.traitEnCours).toBe(false);
  });

  it('#sourisCliquee devrait mettre peutCliquer vrai si peutCliquer est faux au debut de la fonction', () => {
    service.peutCliquer = false;
    service.sourisCliquee(new MouseEvent('onclick'));
    expect(service.peutCliquer).toBe(true);
  });

  // TESTS sourisDeplacee

  it('#sourisDeplacee ne devrait pas appeler setSVGEnCours si traitEnCours est faux', () => {
    service.traitEnCours = false;
    spyOn(stockageService, 'setSVGEnCours');
    service.sourisDeplacee(new MouseEvent('release'));
    expect(stockageService.setSVGEnCours).not.toHaveBeenCalled();
  });

  it('#sourisDeplacee devrait appeler setSVGEnCours après le mouvement de la souris', () => {
    spyOn(stockageService, 'setSVGEnCours');
    service.sourisDeplacee(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
    expect(stockageService.setSVGEnCours).toHaveBeenCalled();
  });

  // TESTS sourisEnfoncee

  it('#sourisEnfoncee devrait mettre traitEnCours vrai si traitEnCours est faux au debut de la fonction', () => {
    service.traitEnCours = false;
    service.sourisEnfoncee(new MouseEvent('onclick'));
    expect(service.traitEnCours).toBe(true);
  });

  it('#sourisEnfoncee devrait appeler setSVGEnCours avec le path SVG après avoir cliqué', () => {
    const clic = new MouseEvent('click', { clientX: 100, clientY: 100 });
    spyOn(stockageService, 'setSVGEnCours');
    service.sourisEnfoncee(clic);
    expect(stockageService.setSVGEnCours).toHaveBeenCalledWith(SVGPath);
  });

  // TESTS sourisRelachee

  it('#sourisRelachee ne devrait pas appeler setSVGEnCours si traitEnCours est faux', () => {
    service.traitEnCours = false;
    spyOn(stockageService, 'setSVGEnCours');
    service.sourisRelachee(new MouseEvent('release'));
    expect(stockageService.setSVGEnCours).not.toHaveBeenCalled();
  });

  it("#sourisRelachee ne devrait pas ajouter le SVG s'il ne contient pas 'L'", () => {
    spyOn(stockageService, 'ajouterSVG');
    service.sourisRelachee(new MouseEvent('release'));
    expect(stockageService.ajouterSVG).not.toHaveBeenCalled();
  });

  it("#sourisRelachee  devrait appeler ajouterSVG si le SVG contient 'L'", () => {
    stockageService.setSVGEnCours('<svg L />')
    spyOn(stockageService, 'ajouterSVG');
    service.sourisRelachee(new MouseEvent('release'));
    expect(stockageService.ajouterSVG).toHaveBeenCalled();
  });

  it("#sourisRelachee  devrait appeler setSVGEnCours si le SVG contient 'L'", () => {
    stockageService.setSVGEnCours('<svg L />')
    spyOn(stockageService, 'setSVGEnCours');
    service.sourisRelachee(new MouseEvent('release'));
    expect(stockageService.setSVGEnCours).toHaveBeenCalled();
  });

  it('#sourisRelachee devrait mettre traitEnCours faux si traitEnCours est vrai au debut de la fonction', () => {
    service.sourisRelachee(new MouseEvent('onclick'));
    expect(service.traitEnCours).toBe(false);
  });

  it('#sourisRelachee devrait mettre peutCliquer vrai si traitEnCours est vrai au debut de la fonction', () => {
    service.sourisRelachee(new MouseEvent('onclick'));
    expect(service.peutCliquer).toBe(true);
  });

  // TESTS sourisSortie

  it('#sourisSortie ne devrait pas appeler setSVGEnCours si traitEnCours est faux', () => {
    service.traitEnCours = false;
    spyOn(stockageService, 'ajouterSVG');
    service.sourisSortie(new MouseEvent('release'));
    expect(stockageService.ajouterSVG).not.toHaveBeenCalled();
  });

  it('#sourisSortie devrait appeler ajouterSVG', () => {
    spyOn(stockageService, 'ajouterSVG');
    service.sourisSortie(new MouseEvent('release'));
    expect(stockageService.ajouterSVG).toHaveBeenCalled();
  });

  it('#sourisSortie devrait appeler setSVGEnCours', () => {
    spyOn(stockageService, 'setSVGEnCours');
    service.sourisSortie(new MouseEvent('release'));
    expect(stockageService.setSVGEnCours).toHaveBeenCalled();
  });

  it('#sourisSortie devrait mettre traitEnCours faux si traitEnCours est vrai', () => {
    service.sourisSortie(new MouseEvent('release'));
    expect(service.traitEnCours).toBe(false);
  });

  it('#sourisSortie devrait mettre peutCliquer faux si traitEnCours est faux', () => {
    service.traitEnCours = false;
    service.sourisSortie(new MouseEvent('release'));
    expect(service.peutCliquer).toBe(false);
  });
});
