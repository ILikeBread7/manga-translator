import { TestBed, inject } from '@angular/core/testing';

import { BubblesService } from './bubbles.service';

describe('BubblesServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BubblesService]
    });
  });

  it('should be created', inject([BubblesService], (service: BubblesService) => {
    expect(service).toBeTruthy();
  }));
});
