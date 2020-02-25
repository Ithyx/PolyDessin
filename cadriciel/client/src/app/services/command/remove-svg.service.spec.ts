import { TestBed } from '@angular/core/testing';
import { RemoveSVGService } from './remove-svg.service';


describe('RetraitSvgService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RemoveSVGService = TestBed.get(RemoveSVGService);
    expect(service).toBeTruthy();
  });
});
