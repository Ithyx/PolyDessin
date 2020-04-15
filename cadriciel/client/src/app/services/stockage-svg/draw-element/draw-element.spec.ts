import { TestBed } from '@angular/core/testing';

import { DrawElement } from './draw-element';

describe('DrawElement', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrawElement = TestBed.get(DrawElement);
    expect(service).toBeTruthy();
  });
});
