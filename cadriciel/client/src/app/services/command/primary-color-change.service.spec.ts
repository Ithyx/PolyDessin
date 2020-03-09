import { TestBed } from '@angular/core/testing';
import { ColorParameterService } from '../color/color-parameter.service';
import { RectangleService } from '../stockage-svg/rectangle.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { PrimaryColorChangeService } from './primary-color-change.service';

describe('PrimaryColorChangeService', () => {
  let stockageService: SVGStockageService;
  let colorParameter: ColorParameterService;
  let service: PrimaryColorChangeService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    stockageService = TestBed.get(SVGStockageService);
    stockageService.addSVG(new RectangleService());
    colorParameter = TestBed.get(ColorParameterService);
    service = new PrimaryColorChangeService(0, stockageService, colorParameter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
