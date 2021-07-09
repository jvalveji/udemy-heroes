import { TestBed } from '@angular/core/testing';

import { IconosService } from './iconos.service';

describe('IconosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IconosService = TestBed.inject(IconosService);
    expect(service).toBeTruthy();
  });
});
