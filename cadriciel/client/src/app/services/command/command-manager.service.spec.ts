import { TestBed } from '@angular/core/testing';
import { CommandManagerService } from './command-manager.service';

describe('GestionnaireCommandesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommandManagerService = TestBed.get(CommandManagerService);
    expect(service).toBeTruthy();
  });
});
