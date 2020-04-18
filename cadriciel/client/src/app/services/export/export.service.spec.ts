import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { ExportService } from './export.service';

describe('ExportService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule]
  }));

  it('should be created', () => {
    const service: ExportService = TestBed.get(ExportService);
    expect(service).toBeTruthy();
  });
});
