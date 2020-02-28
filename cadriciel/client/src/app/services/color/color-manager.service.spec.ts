import { TestBed } from '@angular/core/testing';

import { ColorManagerService, Scope } from './color-manager.service';

describe('ColorManagerService', () => {
  let service: ColorManagerService;
  let scope: Scope;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(ColorManagerService));

  it('should be created', () => {
    const testService: ColorManagerService = TestBed.get(ColorManagerService);
    expect(testService).toBeTruthy();
  });

  it('#getCouleur devrait retourner la couleur actuel avec une opacité de 1', () => {
    expect(service.getColor()).toBe('rgba(0, 0, 0,1)');
  });

  // TEST editRGB

  it('#editRGB devrait modifier la couleur avec le nouveau RGB', () => {
    service.RGB = [1, 2, 3];
    service.editRGB();

    expect(service.color).toBe('rgba(1, 2, 3, ');
  });

  // TESTS applyColor

  it('#applyColor devrait changer la couleur principale si la Scope est Principale', () => {
    scope = Scope.Primary;
    service.applyColor(scope);

    expect(service.colorParameter.primaryColor).toBe('rgba(0, 0, 0,');
  });

  it('#applyColor devrait ajouter la couleur au tableau derniereCouleur si la Scope est Principale', () => {
    scope = Scope.Primary;
    spyOn(service, 'addLastColor');
    service.applyColor(scope);

    expect(service.addLastColor).toHaveBeenCalled();
  });

  it('#applyColor devrait changer la couleur secondaire si la Scope est Secondaire', () => {
    scope = Scope.Secondary;
    service.applyColor(scope);

    expect(service.colorParameter.secondaryColor).toBe('rgba(0, 0, 0,');
  });

  it('#applyColor devrait ajouter la couleur au tableau derniereCouleur si la Scope est Secondaire', () => {
    scope = Scope.Secondary;
    spyOn(service, 'addLastColor');
    service.applyColor(scope);

    expect(service.addLastColor).toHaveBeenCalled();
  });

  it('#applyColor devrait changer la couleur de fond si la Scope est Fond', () => {
    scope = Scope.Background;
    service.applyColor(scope);

    expect(service.colorParameter.backgroundColor).toBe('rgba(0, 0, 0,1)');
  });

  it('#applyColor ne devrait rien faire si la Scope est non reconnue', () => {
    scope = Scope.Default;
    service.applyColor(scope);
    spyOn(service, 'addLastColor');

    expect(service.addLastColor).not.toHaveBeenCalled();
  });

  // TESTS addLastColor

  it('#addLastColor devrait ajouter la couleur au début du tableau derniereCouleur ', () => {
    service.addLastColor();
    expect(service.colorParameter.lastColors[0]).toBe(service.color);
  });

  it('#addLastColor devrait retirer des couleurs du tableau derniereCouleur si celui-ci en contient plus de 10', () => {
    service.colorParameter.lastColors = [
      'rgba(0, 0, 0, ',
      'rgba(0, 0, 1, ',
      'rgba(0, 0, 2, ',
      'rgba(0, 0, 3, ',
      'rgba(0, 0, 4, ',
      'rgba(0, 0, 5, ',
      'rgba(0, 0, 6, ',
      'rgba(0, 0, 7, ',
      'rgba(0, 0, 8, ',
      'rgba(0, 0, 9, ',
      'rgba(0, 0, 10, ',
      'rgba(0, 0, 11, ',
      'rgba(0, 0, 12, ',
    ]; // taille de 13
    service.addLastColor();
    expect(service.colorParameter.lastColors.length).toBe(10);
  });

});
