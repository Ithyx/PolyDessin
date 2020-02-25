import { TestBed } from '@angular/core/testing';
import { LineService } from './line.service';

describe('LigneService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  let service: LineService;

  it('should be created', () => {
    service = TestBed.get(LineService);
    expect(service).toBeTruthy();
  });

  // TESTS avecPoints

  /*it('#avecPoints devrait créer un cercle SVG pour chaque point', () => {
    service.points.push({x: 1, y: 1});
    const SVG = ' <circle cx="0" cy="0" r="5" fill="black"/> <circle cx="1" cy="1" r="5" fill="black"/>';
    let testSVG: string;
    testSVG = '';
    testSVG = service.avecPoints(testSVG);
    expect(testSVG).toBe(SVG);
  });

    // TESTS actualiserSVG

    it("#actualiserSVG devrait retourner un SVG de tous les points sans l'option avec Points", () => {
      service.ligne.points.push({x: 1, y: 1});
      // les 2 derniers '0' sont ceux de la position du curseur
      SVG = '<polyline fill="none" stroke="black" stroke-width="5" points="0 0 1 1 0 0"/>';
      spyOn(stockageService, 'setSVGEnCours');
      service.actualiserSVG();
      expect(stockageService.setSVGEnCours).toHaveBeenCalledWith(SVG);
    });

    it("#actualiserSVG devrait retourner un SVG de tous les points sans l'option avec Points", () => {
      service.outils.outilActif.parametres[1].optionChoisie = 'Avec points';
      service.ligne.points.push({x: 1, y: 1});
      // les 2 derniers '0' sont ceux de la position du curseur
      SVG = '<polyline fill="none" stroke="black" stroke-width="5" points="0 0 1 1 0 0"/>';
      spyOn(service.ligne, 'dessiner');
      service.actualiserSVG();
      expect(service.ligne.dessiner).toHaveBeenCalledWith(SVG);
    });*/

});
