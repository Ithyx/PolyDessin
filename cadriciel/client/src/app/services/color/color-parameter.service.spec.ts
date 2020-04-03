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

  // TESTS intervertColors

  it('#intervertColors devrait échanger la couleur principale et la couleur secondaire', () => {
    service.primaryColor = {RGBAString: 'rgba(1, 2, 3, 1)', RGBA: [1, 2, 3, 1]};
    service.secondaryColor = {RGBAString: 'rgba(3, 2, 1, 1)', RGBA: [3, 2, 1, 1]};

    const primaryColorCopy = {...service.primaryColor};
    const secondaryColorCopy = {...service.secondaryColor};

    service.intervertColors();

    expect(service.primaryColor).toEqual(secondaryColorCopy);
    expect(service.secondaryColor).toEqual(primaryColorCopy);
  });

  it('#intervertColors devrait échanger l\'opacité principale et l\'opacité secondaire', () => {
    service.primaryOpacityDisplayed = 78;
    service.secondaryOpacityDisplayed = 52;
    service.intervertColors();
    expect(service.primaryOpacityDisplayed).toBe(52);
    expect(service.secondaryOpacityDisplayed).toBe(78);
  });

  // TEST updateColors

  it('#updateColors devrait modifier le string de la couleur principale', () => {
    service.primaryColor = {RGBAString: 'rgba(0, 0, 0, 0)', RGBA: [1, 2, 3, 1]};

    service.updateColors();
    expect(service.primaryColor.RGBAString).toBe(`rgba(${service.primaryColor.RGBA[0]}, ${service.primaryColor.RGBA[1]},
      ${service.primaryColor.RGBA[2]}, ${service.primaryColor.RGBA[3]})`);
  });

  it('#updateColors devrait modifier le string de la couleur secondaire', () => {
    service.secondaryColor = {RGBAString: 'rgba(0, 0, 0, 0)', RGBA: [3, 2, 1, 1]};

    service.updateColors();
    expect(service.secondaryColor.RGBAString).toBe(`rgba(${service.secondaryColor.RGBA[0]}, ${service.secondaryColor.RGBA[1]},
      ${service.secondaryColor.RGBA[2]}, ${service.secondaryColor.RGBA[3]})`);
  });

});
