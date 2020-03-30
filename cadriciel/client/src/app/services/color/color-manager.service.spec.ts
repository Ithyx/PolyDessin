import { TestBed } from '@angular/core/testing';

import { ColorManagerService, Scope } from './color-manager.service';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

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
    expect(service.getColor().RGBAString).toBe('rgba(0, 0, 0, 1)');
  });

  // TESTS applyColor

  it('#applyColor devrait changer la couleur principale si la Scope est Principale', () => {
    scope = Scope.Primary;
    service.applyColor(scope);

    expect(service.colorParameter.primaryColor.RGBAString).toBe('rgba(0, 0, 0, 1)');
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

    expect(service.colorParameter.secondaryColor.RGBAString).toBe('rgba(0, 0, 0, 1)');
  });

  it('#applyColor devrait ajouter la couleur au tableau derniereCouleur si la Scope est Secondaire', () => {
    scope = Scope.Secondary;
    spyOn(service, 'addLastColor');
    service.applyColor(scope);

    expect(service.addLastColor).toHaveBeenCalled();
  });

  it(`#applyColor devrait changer la couleur de fond temporaire lors de la creation de nouveau dessin
      si le Scope est BackgroundNewDrawing`, () => {
    scope = Scope.BackgroundNewDrawing;
    service.applyColor(scope);

    expect(service.colorParameter.temporaryBackgroundColor.RGBAString).toBe('rgba(0, 0, 0, 1)');
  });

  it(`#applyColor devrait changer la couleur de fond sur la barre d\'outils
      si le Scope est BackgroundToolBar`, () => {
    scope = Scope.BackgroundToolBar;
    service.applyColor(scope);

    expect(service.colorParameter.temporaryBackgroundColor.RGBAString).toBe('rgba(0, 0, 0, 1)');
    expect(service.drawingManager.backgroundColor.RGBAString).toBe('rgba(0, 0, 0, 1)');
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
      {
        RGBAString: 'rgba(0, 0, 0, 1',
        RGBA: [0, 0, 0, 1]
      },
      {
        RGBAString: 'rgba(0, 0, 1, 1',
        RGBA: [0, 0, 1, 1]
      },
      {
        RGBAString: 'rgba(0, 0, 2, 1',
        RGBA: [0, 0, 2, 1]
      },
      {
        RGBAString: 'rgba(0, 0, 3, 1',
        RGBA: [0, 0, 3, 1]
      },
      {
        RGBAString: 'rgba(0, 0, 4, 1',
        RGBA: [0, 0, 4, 1]
      },
      {
        RGBAString: 'rgba(0, 0, 5, 1',
        RGBA: [0, 0, 5, 1]
      },
      {
        RGBAString: 'rgba(0, 0, 6, 1',
        RGBA: [0, 0, 6, 1]
      },
      {
        RGBAString: 'rgba(0, 0, 7, 1',
        RGBA: [0, 0, 7, 1]
      },
      {
        RGBAString: 'rgba(0, 0, 8, 1',
        RGBA: [0, 0, 8, 1]
      },
      {
        RGBAString: 'rgba(0, 0, 9, 1',
        RGBA: [0, 0, 9, 1]
      },
      {
        RGBAString: 'rgba(0, 0, 10, 1',
        RGBA: [0, 0, 10, 1]
      },
      {
        RGBAString: 'rgba(0, 0, 11, 1',
        RGBA: [0, 0, 11, 1]
      },
      {
        RGBAString: 'rgba(0, 0, 12, 1',
        RGBA: [0, 0, 12, 1]
      }
    ]; // taille de 13
    service.addLastColor();
    expect(service.colorParameter.lastColors.length).toBe(10);
  });

});
