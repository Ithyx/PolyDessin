import { TestBed } from '@angular/core/testing';

import { DessinRectangleService } from './dessin-rectangle.service';

describe('DessinRectangleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DessinRectangleService = TestBed.get(DessinRectangleService);
    expect(service).toBeTruthy();
  });
});
