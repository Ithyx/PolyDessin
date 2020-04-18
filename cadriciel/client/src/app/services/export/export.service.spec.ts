import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { ExportService } from './export.service';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('ExportService', () => {
  let service: ExportService;
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule]
  }));
  beforeEach(() => service = TestBed.get(ExportService));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
