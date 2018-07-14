import { TestBed, inject } from '@angular/core/testing';

import { ImageExportService } from './image-export.service';

describe('ImageExportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageExportService]
    });
  });

  it('should be created', inject([ImageExportService], (service: ImageExportService) => {
    expect(service).toBeTruthy();
  }));
});
