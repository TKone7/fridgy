import { TestBed } from '@angular/core/testing';

import { GepirSearchService } from './gepir-search.service';

describe('GepirSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GepirSearchService = TestBed.get(GepirSearchService);
    expect(service).toBeTruthy();
  });
});
