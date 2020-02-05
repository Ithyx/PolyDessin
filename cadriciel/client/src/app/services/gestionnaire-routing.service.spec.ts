import { TestBed } from '@angular/core/testing';

import { GestionnaireRoutingService } from './gestionnaire-routing.service';

describe('GestionnaireRoutingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GestionnaireRoutingService = TestBed.get(GestionnaireRoutingService);
    expect(service).toBeTruthy();
  });
});
