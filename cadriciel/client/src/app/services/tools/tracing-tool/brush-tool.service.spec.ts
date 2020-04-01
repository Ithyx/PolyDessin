import { TestBed } from '@angular/core/testing';
import { TraceBrushService } from '../../stockage-svg/trace-brush.service';
import { BrushToolService } from './brush-tool.service';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('BrushToolService', () => {
  let service: BrushToolService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(BrushToolService));

  it('should be created', () => {
    const testService: BrushToolService = TestBed.get(BrushToolService);
    expect(testService).toBeTruthy();
  });

  // TESTS resetTrace
  it('#resetTrace devrait réinitialiser le trait', () => {
    service['trace'] = new TraceBrushService();
    service['trace'].svg = 'test svg';
    service.resetTrace();
    expect(service['trace']).toEqual(new TraceBrushService());
  });

  it('#resetTrace devrait mettre drawingInProgress de commands à faux', () => {
    service['commands'].drawingInProgress = true;
    service.resetTrace();
    expect(service['commands'].drawingInProgress).toBe(false);
  });
});
