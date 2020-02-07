import { TestBed } from '@angular/core/testing';

import { ServiceCouleurService } from './service-couleur.service';

describe('ServiceCouleurService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceCouleurService = TestBed.get(ServiceCouleurService);
    expect(service).toBeTruthy();
  });
});
