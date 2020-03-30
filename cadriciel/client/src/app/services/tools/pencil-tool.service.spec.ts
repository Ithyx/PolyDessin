import { TestBed } from '@angular/core/testing';
import { TracePencilService } from '../stockage-svg/trace-pencil.service';
import { PencilToolService } from './pencil-tool.service';

// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal

describe('PencilToolService', () => {
  let service: PencilToolService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(PencilToolService));
  it('should be created', () => {
    const testService: PencilToolService = TestBed.get(PencilToolService);
    expect(testService).toBeTruthy();
  });

  // TESTS resetTrace
  it('#resetTrace devrait réinitialiser le trait', () => {
    service['trace'] = new TracePencilService();
    service['trace'].svg = 'test svg';
    service.resetTrace();
    expect(service['trace']).toEqual(new TracePencilService());
  });

  it('#resetTrace devrait mettre drawingInProgress de commands à faux', () => {
    service['commands'].drawingInProgress = true;
    service.resetTrace();
    expect(service['commands'].drawingInProgress).toBe(false);
  });
});
