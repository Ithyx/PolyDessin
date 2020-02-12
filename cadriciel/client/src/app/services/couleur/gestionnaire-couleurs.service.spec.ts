import { TestBed } from '@angular/core/testing';

import { GestionnaireCouleursService } from './gestionnaire-couleurs.service';

describe('GestionnaireCouleursService', () => {
  let service: GestionnaireCouleursService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(GestionnaireCouleursService));

  it('should be created', () => {
    const testService: GestionnaireCouleursService = TestBed.get(GestionnaireCouleursService);
    expect(testService).toBeTruthy();
  });

  /* it('#getCouleur devrait retourner la couleur actuel avec une opacité de 1', () => {
    expect(service.getCouleur).toBe('rgba(0, 0, 0, 1)');
  }); */

  it('#modifierRGB devrait modifier la couleur avec le nouveau RGB', () => {
    service.RGB = [1, 2, 3];
    service.modifierRGB();

    expect(service.couleur).toBe('rgba(1, 2, 3, ');
  });
});
