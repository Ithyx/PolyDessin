import { TestBed } from '@angular/core/testing';

import { PaintBucketToolService } from './paint-bucket-tool.service';

describe('PaintBucketToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaintBucketToolService = TestBed.get(PaintBucketToolService);
    expect(service).toBeTruthy();
  });
});
