import { TestBed } from '@angular/core/testing';

import { ColorParameterService } from './color-parameter.service';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

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
    const primaryColorCopy = service.primaryColor;
    const secondaryColorCopy = service.secondaryColor;

    service.intervertColors();

    expect(service.primaryColor).toBe(secondaryColorCopy);
    expect(service.secondaryColor).toBe(primaryColorCopy);
  });

});
