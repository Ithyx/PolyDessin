import { TestBed } from '@angular/core/testing';

import { ColorParameterService } from './color-parameter.service';

describe('ColorParameterService', () => {
  let service: ColorParameterService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(ColorParameterService));

  it('should be created', () => {
    const testService: ColorParameterService = TestBed.get(ColorParameterService);
    expect(testService).toBeTruthy();
  });

  // TEST intervertirCouleur

  it('#intervetirCouleur devrait échanger la couleur principale et la couleur secondaire', () => {
    const copieCouleurPrincipal = service.primaryColor;
    const copieCouleurSecondaire = service.secondaryColor;

    service.intervertColors();

    expect(service.primaryColor).toBe(copieCouleurSecondaire);
    expect(service.secondaryColor).toBe(copieCouleurPrincipal);
  });

  // TEST getPrimaryColor

  it('#getPrimaryColor devrait retourner la couleur principale avec une opacité de 1', () => {
    expect(service.getPrimaryColor()).toBe('rgba(0, 0, 0, 1)');
  });

  // TEST getCouleurSecondaire

  it('#getCouleurSecondaire devrait retourner la couleur secondaire avec une opacité de 1', () => {
    expect(service.getSecondaryColor()).toBe('rgba(0, 0, 0, 1)');
  });

});
