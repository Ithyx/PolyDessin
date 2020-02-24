import { TestBed } from '@angular/core/testing';

import { OutilGrilleService } from './outil-grille.service';

describe('OutilGrilleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OutilGrilleService = TestBed.get(OutilGrilleService);
    expect(service).toBeTruthy();
  });
});
