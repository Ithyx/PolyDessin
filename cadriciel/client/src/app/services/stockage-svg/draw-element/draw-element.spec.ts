import { TestBed } from '@angular/core/testing';

import { DrawElement, HALF_CIRCLE } from './draw-element';
import { TracePencilService } from './trace/trace-pencil.service';

// tslint:disable: no-string-literal
// tslint:disable:no-magic-numbers

describe('DrawElement', () => {
  let element: DrawElement;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    element = new TracePencilService();
  });

  it('should be created', () => {
    expect(element).toBeTruthy();
  });

  // TESTS updateTranslation

  it('#updateTranslation devrait appeler la fonction updateTransform avec le bon paramètre', () => {
    const spy = spyOn(element, 'updateTransform');
    const test = {a: 1, b: 0, c: 0, d: 1, e: 10, f: 10};
    element.updateTranslation(10, 10);
    expect(spy).toHaveBeenCalledWith(test);
  });

  // TESTS updateTranslationMouse

  it('#updateTranslationMouse devrait appeler la fonction updateTransform avec le bon paramètre', () => {
    const spy = spyOn(element, 'updateTransform');
    const test = {a: 1, b: 0, c: 0, d: 1, e: 10, f: 10};
    element.updateTranslationMouse(new MouseEvent('mousemove', { movementX: 10, movementY: 10 }));
    expect(spy).toHaveBeenCalledWith(test);
  });

  // TESTS updateRotation

  it('#updateRotation devrait appeler la fonction updateTransform avec le bon paramètre', () => {
    const angle = 10;
    const x = 10;
    const y = 10;

    const radianAngle = angle * (Math.PI / HALF_CIRCLE);
    const aRotation = Math.cos(radianAngle);
    const bRotation = Math.sin(radianAngle);
    const cRotation = -Math.sin(radianAngle);
    const dRotation = Math.cos(radianAngle);
    const eRotation = (1 - Math.cos(radianAngle)) * x + Math.sin(radianAngle) * y;
    const fRotation = (1 - Math.cos(radianAngle)) * y - Math.sin(radianAngle) * x;
    const test = {a: aRotation, b: bRotation, c: cRotation, d: dRotation, e: eRotation, f: fRotation };

    const spy = spyOn(element, 'updateTransform');
    element.updateRotation(10, 10, 10);
    expect(spy).toHaveBeenCalledWith(test);
  });

  // TESTS updateTransform

  it('#updateTranslationMouse devrait attribuer de nouvelles valeurs à transform', () => {
    element.transform = {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6};
    const test = element.transform;
    const parametre = {a: 1, b: 0, c: 0, d: 1, e: 10, f: 10};

    const oldTransform = {...element.transform};
    test.a = oldTransform.a * parametre.a + oldTransform.b * parametre.c;
    test.b = oldTransform.a * parametre.b + oldTransform.b * parametre.d;
    test.c = oldTransform.c * parametre.a + oldTransform.d * parametre.c;
    test.d = oldTransform.c * parametre.b + oldTransform.d * parametre.d;
    test.e = oldTransform.e * parametre.a + oldTransform.f * parametre.c + parametre.e;
    test.f = oldTransform.e * parametre.b + oldTransform.f * parametre.d + parametre.f;

    element.updateTransform(parametre);
    expect(element.transform).toEqual(test);
  });

  it('#updateTranslationMouse devrait appeler la fonction draw', () => {
    const spy = spyOn(element, 'draw');
    const test = {a: 1, b: 0, c: 0, d: 1, e: 10, f: 10};
    element.updateTransform(test);
    expect(spy).toHaveBeenCalled();
  });
});
