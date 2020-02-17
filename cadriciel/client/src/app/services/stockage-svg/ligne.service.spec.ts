import { TestBed } from '@angular/core/testing';

import { LigneService } from './ligne.service';

describe('LigneService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  let service: LigneService;

  it('should be created', () => {
    service = TestBed.get(LigneService);
    expect(service).toBeTruthy();
  });

  // TESTS avecPoints

  it('#avecPoints devrait créer un cercle SVG pour chaque point', () => {
    service.points.push({x: 1, y: 1});
    const SVG = ' <circle cx="0" cy="0" r="5" fill="black"/> <circle cx="1" cy="1" r="5" fill="black"/>';
    let testSVG: string;
    testSVG = '';
    testSVG = service.avecPoints(testSVG);
    expect(testSVG).toBe(SVG);
  });

});
