import { TestBed } from '@angular/core/testing';

import { ProcesoSIGESService } from './proceso-siges.service';

describe('ProcesoSIGESService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProcesoSIGESService = TestBed.inject(ProcesoSIGESService);
    expect(service).toBeTruthy();
  });
});
