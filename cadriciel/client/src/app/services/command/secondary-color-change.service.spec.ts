import { TestBed } from '@angular/core/testing';
import { ColorParameterService } from '../color/color-parameter.service';
import { LineService } from '../stockage-svg/line.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { SecondaryColorChangeService } from './secondary-color-change.service';

describe('SecondaryColorChangeService', () => {
  let stockageService: SVGStockageService;
  let colorParameter: ColorParameterService;
  let service: SecondaryColorChangeService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    stockageService = TestBed.get(SVGStockageService);
    stockageService.addSVG(new LineService());
    colorParameter = TestBed.get(ColorParameterService);
    service = new SecondaryColorChangeService(0, stockageService, colorParameter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
