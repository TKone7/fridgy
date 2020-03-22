import { TestBed } from '@angular/core/testing';

import { FridgeManagerService } from './fridge-manager.service';

describe('FridgeManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FridgeManagerService = TestBed.get(FridgeManagerService);
    expect(service).toBeTruthy();
  });
});
